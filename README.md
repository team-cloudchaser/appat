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