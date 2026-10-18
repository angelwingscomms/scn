# publishing

The owner signs in at `/admin`. Readers need no account.
Create a short post, article, video or announcement; save a draft, preview it,
then change visibility to published and save. Set visibility back to draft
to unpublish. A stale editor cannot overwrite a newer revision.

Videos accept MP4 or WebM up to 27 MiB. Save the draft before uploading.
Save again to attach the upload. A transcript can accompany the video.
Published posts appear at `/updates`, in `/notifications` and `/feed.xml`.
Blog content is plain text with paragraph breaks; HTML is never rendered.

Readers opt in at `/notifications`. Browser permission is requested only
after pressing the button. Opting out removes the device's delivery address.
The inbox tracks read status on that device without an account. iOS browser
push requires adding the site to the home screen and opening it there.

Publishing does not send a push automatically. The owner presses
"send browser notification" on a published post. Keep the page open while
it sends; an interrupted delivery resumes from its saved cursor. Delivery
counts show failures. Retrying a completed failed broadcast sends to all
followers again; duplicate deliveries use the post id as the notification tag.
Followers who subscribe after a broadcast starts are excluded from that run.

## secrets

Set these Worker secrets before owner publishing and browser push can work:

- `ADMIN_PASSWORD`: a strong password of at least 10 characters.
- `VAPID_PUBLIC_KEY`: the base64url uncompressed P-256 public point.
- `VAPID_PRIVATE_KEY`: the base64url P-256 private scalar.

Keep the VAPID pair stable: replacing it invalidates existing subscriptions.
Changing the owner password signs out every existing owner session.
Never commit actual secret values. `.env.example` lists the names.
For local development, add them to the ignored `.env` file.

The existing `F` R2 bucket stores everything under `journal/`.
Paid book objects and their download authorization stay separate.
Conditional R2 writes protect edits and delivery progress. Deletions retain
a private tombstone to prevent delayed editors from restoring a deleted post;
the currently attached video is removed. Unattached or replaced uploads are
not automatically removed. Post listing reads R2 summary metadata and suits
a single author's publishing volume; it does not introduce a database.

`@block65/webcrypto-web-push` supplies Workers-compatible Web Push encryption
and VAPID authentication. No email service or push gateway is required.
Typechecking and production compilation are available with `pnpm check`
and `pnpm build`. No tests were added or run after that was requested.
Deploy through the existing GitHub push build.
