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
  - `r`: **Only valid for non-WebSockets for browsers**. Value of the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#referrer) header. This field is currently mostly repurposed to handle early payload data encoded in [URL-safe Base64](https://datatracker.ietf.org/doc/html/rfc4648#section-5).
  - `h`: **Only valid for non-WebSockets for browsers**. The map of all of the header key-value pairs to send on request initiation. Should not be one of the [forbidden headers](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_request_header) in browsers.

## Support
This section is strictly for this reference implementation.

### Protocols
| Protocol | Supported? |
| -------- | ---------- |
| `WS` | Yes |
| `WT` | No |
| `GET` | Yes |
| `POST` etc. | No |

## FAQ
### Can the reference implementation be used for all HTTP-based requests?
Most, but not all. gRPC and `GET` requests with bodies are examples that cannot be tunneled via Appat or any other browser dialers. However, we encourage any project to build a headless dialer contemplating this.