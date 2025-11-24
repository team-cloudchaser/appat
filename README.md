# Appat
🍨 Implementation-agnostic universal browser dialer. Source of name [here](https://www.fimfiction.net/story/579757/).

> **Warning**
> 
> To run as efficiently as possible, Appat requires a JS runtime supporting both [`WebSocketStream`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocketStream) and [`ReadableStream` in request bodies](https://developer.mozilla.org/en-US/docs/Web/API/Request/body) (e.g. Chromium 124+, Deno unstable).
> 
> If you want to have a smooth experience for browser dialers on Firefox, please consider upvoting [here](https://connect.mozilla.org/t5/discussions/where-s-firefox-going-next-you-tell-us/m-p/101159/highlight/true#M39335) and expressing yourself in [this Firefox issue](https://bugzilla.mozilla.org/show_bug.cgi?id=1387483). This will help high-throughput data processing in general.

## Protocol
### Command schema
```json
{
	"m": "PUT",
	"u": "https://relay.example.com/madi",
	"c": "00000000-0000-0000-0000-000000000000",
	"e": {
		"p": "WW914oCZcmUgc3dlZXQgb24gdGhlIHBvbnksIGFyZW7igJl0IHlvdT8KVGhhdOKAmXMgaW1wb3NzaWJsZS4gV2XigJlyZSBmcm9tIGRpZmZlcmVudCB3b3JsZHMu",
		"r": "https://relay.example.com/dairy",
		"h": {
			"Accept": "application/xml",
			"Authorization": "Bearer RXZlbiB0aG91Z2ggeW914oCZcmUgZ29pbmcgdG8gd2lwZSBteSBtZW1vcmllcywgSeKAmWQgbG92ZSB0byBoZWFyIGFib3V0IHlvdSBncm93aW5nIHVwLiBNYXliZSBtYWtlIHlvdSBsYXVnaCBhZ2Fpbi4"
		}
	}
}
```
- `m`: Request method. One of [`WS`](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API), [`WT`](https://developer.mozilla.org/en-US/docs/Web/API/WebTransport_API), `GET`, `POST`, `PUT` and [more](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods).
- `u`: Destination URL. Must begin with one of `ws://` and `wss://` under `WS`, and `http://` or `https://` if otherwise.
- `c`: Connection UUID. This is set to distinguish relayed connections apart. Each relayed connection will have a different UUID.
- `e`: Extra info. This is an optional field.
  - `p`: **Only valid for WebSockets**. [WebSocket subprotocol](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/protocol), effectively the value of the `Sec-WebSocket-Protocol` header. This field is currently mostly repurposed to handle early payload data encoded in [URL-safe Base64](https://datatracker.ietf.org/doc/html/rfc4648#section-5).
  - `r`: **Only valid for non-WebSockets for browsers**. Value of the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer) header. This field is currently mostly repurposed to handle early payload data encoded in [URL-safe Base64](https://datatracker.ietf.org/doc/html/rfc4648#section-5). The value of this field can change in the dialer.
  - `h`: **Only valid for non-WebSockets for browsers**. The map of all of the header key-value pairs to send on request initiation. Should not be one of the [forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header) in browsers.

#### Connection state schema
```json
{
	"m": "APPAT",
	"u": "https://relay.example.com/madi",
	"c": "00000000-0000-0000-0000-000000000000",
	"e": {
		"appat": "requestEnd"
	}
}
```
When method is set to `APPAT`, the control message instead signals on how to deal with existing connections, as such `c` should match one of the existing connections.

`e.appat` can take one of the following values.

- `requestEnd`: Marks the uploading stream of an existing HTTP request as ended. Beware of racing conditions on the controller side, and remember to always apply backpressure.

### Response status schema
Only viable for normal HTTP requests.
```json
{
	"quota": 255,
	"c": "00000000-0000-0000-0000-000000000000",
	"s": 200,
	"t": "OK",
	"e": "",
	"h": {
		"Content-Type": "application/octet-stream"
	}
}
```
- `quota`: Number of connections still able to be accepted.
- `c`: Connection UUID. The same UUID assigned by the dialer controller.
- `s`: Numeric status.
- `t`: Status text.
- `e`: Optional field. When `s` is set to `0`, this field will contain detailed info on the error.
- `h`: A list of response headers.

### Processing flow
1. The browser visits the page served by the dialer controller (e.g. `127.0.0.1:5779`), and generates a random "page UUID" (e.g. `krsw`). The `token` query parameter or the second command line argument is taken as the CSRF token if it's unset.
2. Dialer connects to the control socket (e.g. `ws://127.0.0.1:5779/krsw/ctrl?token=ookoe`) to receive commands.
3. The data sockets are located under the page UUID (e.g. `ws://127.0.0.1:5779/krsw/00000000-0000-0000-0000-000000000000?token=ookoe`). Upon receiving commands to relay connections...
  - For `WS` connections, the browser dialer simply forwards messages back and forth without any processing.
  - For `GET` requests, the browser dialer simply connects to the data socket, then forwards the response body to it once ready. The dialer will close the connection once the response stream closes.
  - For other requests, the browser dialer first connects to the data socket, then initiates a bidirectional `fetch` forwarding with passthrough.

## Support
This section is strictly for this reference implementation.

### Protocols
| Protocol | Supported? |
| -------- | ---------- |
| `WS` | No |
| `WT` | No |
| `GET` | Yes |
| `POST` etc. | Yes |

## FAQ
### Can the reference implementation be used for all HTTP-based requests?
Most, but not all. gRPC and `GET` requests with bodies are examples that cannot be tunneled via Appat or any other browser dialers. However, we encourage any project to build a headless dialer contemplating this.

### Are the relayed connections fully duplex?
Depending on the actual runtime used with the dialer. If in a browser, none of the current browser supports fully duplex connections. If in headless runtimes like Deno however, it is fully duplex.

### How do I test the dialer without CORS?
- For Chromium: Use `--disable-web-security`. A temporary data directory is also required with `--user-data-dir=tmpData`. Perfect for headless use as well.
- For Firefox: Set `security.fileuri.strict_origin_policy` to `false` (headless friendly), or install the "CORS Everywhere" extension.