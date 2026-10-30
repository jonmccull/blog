# Photos inbox

Drop an original JPEG here on `main` and the `photos` workflow does the rest: it resizes it to
2048px on the long edge as WebP, strips the metadata, reads the camera, exposure and date from the
EXIF, puts an entry at the top of `app/photos/photos.ts`, deletes the original from this folder and
opens a pull request. The pull request shows each photo; fill in its `alt` and `location` on the
branch, then merge.

Ways to get a file in here:

- On github.com (also on a phone): open this folder, **Add file → Upload files**, commit to `main`.
- From a clone: copy the file in, commit, push.

Only this README stays here. Anything that is not an image the script can read is left in place
and listed in the pull request.
