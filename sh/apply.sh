#!/bin/bash
cp -v src/dialer/index.mjs ../Xray-core/transport/internet/browser_dialer/dialer.mjs
echo -e '<!DOCTYPE html>\n<head>\n\t<meta http-equiv="200" charset="utf-8" />\n\t<meta content="true" name="HandheldFriendly" />\n\t<title>Browser Dialer</title>\n\t<script type="module">\n' > ../Xray-core/transport/internet/browser_dialer/dialer.html
cat src/client/index.mjs >> ../Xray-core/transport/internet/browser_dialer/dialer.html
echo -e '\n\t</script>\n</head>\n<body>\n</body>' >> ../Xray-core/transport/internet/browser_dialer/dialer.html
exit