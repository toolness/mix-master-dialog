This is the "Compose a Replacement" dialog box shown in [Web X-Ray Goggles][] when the user presses "R" to remix the currently focused element.

## Setup

Check out the Web X-Ray Goggles repository in the root of this repo, and make sure its directory is called `webxray`.

## Security Considerations

When the dialog is opened in an iframe by the goggles, it's passed arbitrary HTML (whatever the user has selected with the goggles) via `postMessage` and injected into the dialog for live editing by the user. This means that the domain the dialog is served from shouldn't contain any sensitive information; preferably, it should only be used to serve this dialog.

  [Web X-Ray Goggles]: https://github.com/hackasaurus/webxray
