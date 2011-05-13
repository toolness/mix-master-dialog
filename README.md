This is the "Compose a Replacement" dialog box shown in [Web X-Ray Goggles][webxray] when the user presses "R" to remix the currently focused element.

## Setup

Check out the Web X-Ray Goggles repository in the root of this repo, and make
sure its directory is called `webxray`.

Then just run `python server.py` and visit http://127.0.0.1:8002/ to manually
test the dialog with sample data.

To run the unit tests, visit http://localhost:8002/test/.

To use the dialog with the goggles, see the [webxray][] repository
instructions. For reference, your hosted instance of the dialog is at
http://localhost:8002/.

## Security Considerations

When the dialog is opened in an iframe by the goggles, it's passed arbitrary HTML (whatever the user has selected with the goggles) via `postMessage` and injected into the dialog for live editing by the user. This means that the domain the dialog is served from shouldn't contain any sensitive information; preferably, it should only be used to serve this dialog.

  [webxray]: https://github.com/hackasaurus/webxray
