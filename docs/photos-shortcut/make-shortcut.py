#!/usr/bin/env python3
"""Writes the Add to Photos shortcut (docs/photos-shortcut/) as an unsigned .shortcut plist.

Flow: share photos from the Photos app (or pick them) -> ask for a location -> create a draft
release on jonmccull/blog -> convert each photo to JPEG keeping its metadata and upload it as a
release asset -> send a repository_dispatch "photos" with the release id -> notify.
Sign with: shortcuts sign --mode anyone --input <unsigned> --output <signed>
"""
import plistlib, sys, uuid

REPO = 'jonmccull/blog'
OBJ = '￼'

def uid():
    return str(uuid.uuid4()).upper()

def out_ref(action_uuid, name):
    return {'Type': 'ActionOutput', 'OutputUUID': action_uuid, 'OutputName': name}

def var_ref(name):
    return {'Type': 'Variable', 'VariableName': name}

INPUT_REF = {'Type': 'ExtensionInput'}

def attachment(ref):
    return {'Value': ref, 'WFSerializationType': 'WFTextTokenAttachment'}

def text(*parts):
    """parts: str or ref dict; builds a WFTextTokenString with the refs inlined."""
    s, ranges = '', {}
    for p in parts:
        if isinstance(p, str):
            s += p
        else:
            ranges[f'{{{len(s)}, 1}}'] = p
            s += OBJ
    value = {'string': s}
    if ranges:
        value['attachmentsByRange'] = ranges
    return {'Value': value, 'WFSerializationType': 'WFTextTokenString'}

def dict_value(items):
    """items: list of (key, value) where value is a text() token, True/False, or a nested list."""
    out = []
    for k, v in items:
        if isinstance(v, bool):
            out.append({'WFItemType': 4, 'WFKey': text(k),
                        'WFValue': {'Value': v, 'WFSerializationType': 'WFNumberSubstitutableState'}})
        elif isinstance(v, list):
            out.append({'WFItemType': 1, 'WFKey': text(k), 'WFValue': dict_value(v)})
        else:
            out.append({'WFItemType': 0, 'WFKey': text(k), 'WFValue': v})
    return {'Value': {'WFDictionaryFieldValueItems': out}, 'WFSerializationType': 'WFDictionaryFieldValue'}

def action(ident, **params):
    return {'WFWorkflowActionIdentifier': ident, 'WFWorkflowActionParameters': params}

def gh_headers(extra=()):
    items = [('Authorization', text('Bearer ', var_ref('Token'))),
             ('Accept', text('application/vnd.github+json')),
             ('X-GitHub-Api-Version', text('2022-11-28'))]
    items.extend(extra)
    return dict_value(items)

actions = []
u_token, u_ask, u_count, u_date, u_fmt, u_create, u_id = (uid() for _ in range(7))
u_name, u_strip, u_convert, u_upload, u_dispatch = (uid() for _ in range(5))
group = uid()

actions += [
    action('is.workflow.actions.comment', WFCommentActionText=(
        'Add to Photos (jonm.cc). Share one or more photos to this shortcut, or run it and pick them.\n\n'
        'One-time setup: replace the text in the next action with a GitHub fine-grained token for '
        f'{REPO} with Contents: read and write. Everything else is wired.')),
    action('is.workflow.actions.gettext', UUID=u_token, WFTextActionText=text('PASTE-GITHUB-TOKEN-HERE')),
    action('is.workflow.actions.setvariable', WFVariableName='Token', WFInput=attachment(out_ref(u_token, 'Text'))),
    action('is.workflow.actions.ask', UUID=u_ask, WFInputType='Text',
           WFAskActionPrompt=text('Where were these taken? Leave empty to fill it in on the pull request.'),
           WFAskActionDefaultAnswer=text('')),
    action('is.workflow.actions.setvariable', WFVariableName='Location', WFInput=attachment(out_ref(u_ask, 'Provided Input'))),
    action('is.workflow.actions.count', UUID=u_count, WFCountType='Items', Input=attachment(INPUT_REF)),
    action('is.workflow.actions.date', UUID=u_date, WFDateActionMode='Current Date'),
    action('is.workflow.actions.format.date', UUID=u_fmt, WFDateFormatStyle='Custom', WFDateFormat='yyyyMMdd-HHmmss',
           WFDate=attachment(out_ref(u_date, 'Date'))),
    # 1. A draft release: no tag is made, so the originals never enter git history.
    action('is.workflow.actions.downloadurl', UUID=u_create,
           WFURL=text(f'https://api.github.com/repos/{REPO}/releases'),
           WFHTTPMethod='POST', WFHTTPBodyType='JSON', WFHTTPHeaders=gh_headers(),
           WFJSONValues=dict_value([
               ('tag_name', text('photos-inbox-', out_ref(u_fmt, 'Formatted Date'))),
               ('name', text('Photos inbox ', out_ref(u_fmt, 'Formatted Date'))),
               ('body', text('Originals from the Add to Photos shortcut; the photos workflow deletes this release once the pull request is open. Location: ', var_ref('Location'))),
               ('draft', True),
           ])),
    action('is.workflow.actions.getvalueforkey', UUID=u_id, WFGetDictionaryValueType='Value',
           WFDictionaryKey='id', WFInput=attachment(out_ref(u_create, 'Contents of URL'))),
    action('is.workflow.actions.setvariable', WFVariableName='ReleaseID', WFInput=attachment(out_ref(u_id, 'Dictionary Value'))),
    # 2. Each photo: JPEG with its metadata kept (the captions come from the EXIF), uploaded as an asset.
    action('is.workflow.actions.repeat.each', GroupingIdentifier=group, WFControlFlowMode=0, WFInput=attachment(INPUT_REF)),
    action('is.workflow.actions.getitemname', UUID=u_name, WFInput=attachment(var_ref('Repeat Item'))),
    action('is.workflow.actions.text.replace', UUID=u_strip, WFInput=attachment(out_ref(u_name, 'Name')),
           WFReplaceTextFind=r'\.[A-Za-z0-9]+$', WFReplaceTextReplace='',
           WFReplaceTextRegularExpression=True, WFReplaceTextCaseSensitive=False),
    action('is.workflow.actions.image.convert', UUID=u_convert, WFInput=attachment(var_ref('Repeat Item')),
           WFImageFormat='JPEG', WFImageCompressionQuality=1.0, WFImagePreserveMetadata=True),
    action('is.workflow.actions.downloadurl', UUID=u_upload,
           WFURL=text(f'https://uploads.github.com/repos/{REPO}/releases/', var_ref('ReleaseID'), '/assets?name=', out_ref(u_strip, 'Updated Text'), '.jpg'),
           WFHTTPMethod='POST', WFHTTPBodyType='File',
           WFHTTPHeaders=gh_headers([('Content-Type', text('image/jpeg'))]),
           WFRequestVariable=attachment(out_ref(u_convert, 'Converted Image'))),
    action('is.workflow.actions.repeat.each', GroupingIdentifier=group, WFControlFlowMode=2),
    # 3. Tell the photos workflow which release to ingest.
    action('is.workflow.actions.downloadurl', UUID=u_dispatch,
           WFURL=text(f'https://api.github.com/repos/{REPO}/dispatches'),
           WFHTTPMethod='POST', WFHTTPBodyType='JSON', WFHTTPHeaders=gh_headers(),
           WFJSONValues=dict_value([
               ('event_type', text('photos')),
               ('client_payload', [
                   ('release_id', text(var_ref('ReleaseID'))),
                   ('location', text(var_ref('Location'))),
               ]),
           ])),
    action('is.workflow.actions.notification', WFNotificationActionTitle=text('Add to Photos'),
           WFNotificationActionBody=text('Sent ', out_ref(u_count, 'Count'), ' to jonm.cc. A pull request opens in a couple of minutes.')),
]

workflow = {
    'WFWorkflowName': 'Add to Photos',
    'WFWorkflowClientVersion': '2607.0.3',
    'WFWorkflowMinimumClientVersion': 900,
    'WFWorkflowMinimumClientVersionString': '900',
    'WFWorkflowIcon': {'WFWorkflowIconStartColor': 463140863, 'WFWorkflowIconGlyphNumber': 59511},
    'WFWorkflowImportQuestions': [],
    'WFWorkflowTypes': ['ActionExtension'],
    'WFWorkflowInputContentItemClasses': ['WFImageContentItem'],
    'WFWorkflowHasShortcutInputVariables': True,
    'WFWorkflowHasOutputFallback': False,
    'WFWorkflowNoInputBehavior': {'Name': 'WFWorkflowNoInputBehaviorAskForInput',
                                  'Parameters': {'ItemClass': 'WFImageContentItem'}},
    'WFWorkflowActions': actions,
}

out = sys.argv[1]
with open(out, 'wb') as f:
    plistlib.dump(workflow, f)
print(f'wrote {out}: {len(actions)} actions')
