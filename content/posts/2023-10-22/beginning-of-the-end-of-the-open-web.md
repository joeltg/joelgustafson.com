# The beginning of the end of the open web

[Joel Gustafson](/) · _2023-10-22_

A few months ago I was trying to buy tickets to the US Open on Ticketmaster and got stuck on a mysterious error code during checkout. I tried a couple different credit cards, tried checking out using PayPal, tried a different WiFi connection, tried buying slightly different seats, but nothing worked. I even tried to create a completely separate Ticketmaster account, but got stuck when they asked for a phone number during sign-up and rejected my Google Voice number.

I searched around the internet for the error code I was seeing and eventually found people in a Reddit thread sharing a Ticketmast supprt phone number to call. I sat on hold for a while and finally got through to a blunt but friendly man who identified the issue immediately: **my protonmail.com email address**.

Ticketmaster's fraud prevention system automatically flags protonmail.com addresses as "high-risk", he explained. He could temporarily whitelist my account but warned me that it would probably come up again, and the best course of action would be to change my email address to a different provider.

This was a surprise and a disappointment. I had only just finished migrating all my accounts away from my gmail address, and was downright proud of my new home at ProtonMail, excited to retire to the simplicity of paying money for privacy-focused digital services. And, ironically, the last straw that got me to switch was reading stories of people getting randomly locked out of their Google accounts (e.g. due to false-positive copyright strikes on Google Drive content) and stranded without recourse. But now what? Is nowhere safe?

People point to email as an example of a "failed protocol" because it has become impossible to self-host your own email server; the established email providers essentially run a spam cabal that routes mail from unrecognized IP addresses straight to junk, or blocks it altogether. Lots has been written about this already - [here's one example](https://news.ycombinator.com/item?id=30222736) - all in the same bleak tone of aging hackers who've watched the web close down around them.

But even though ProtonMail knows all this and _has_ spent the time and resources to maintain good standing with the other email hosts, there's nothing they can do about a third party blacklisting their addresses on their own. Here, there's no cabal, no conspiracy, just an independent company making a simple buisness decision to block "high-risk" addresses.

So should we get angry at Ticketmaster? Should we get angry at Google? More than we already were? Personally I love getting angry, especially when I can do it in a big group.

---

[Here](https://github.com/explainers-by-googlers/Web-Environment-Integrity/issues/28) are some other people getting angry; maybe we can team up with them?

The [Web Environment Integrity](https://en.wikipedia.org/wiki/Web_Environment_Integrity) (WEI) proposal introduces a new browser API that lets websites request _signed trust attestations_ from the user's device. These attestations are "low-entropy trust signals" and would be signed via your device's trusted computing APIs. This theoretically enables an unforgeable end-to-end software authentication stack: websites _could_ demand proof that you're running unmodified Chrome on an unmodified MacOS installation on a real Apple Macbook, refuse to serve you if you can't provide it, and no amount of jailbreaking your device or spoofing your user agent or even forking Chromium could get around it.

When this hit Hacker News, people instantly clocked it as "DRM for the web", designed to insidiously kill ad-blocking, and went ahead and did some GitHub activism.

Just to get it out of the way, I should say that DRM makes my blood boil and that I wouldn't really trust myself to be civil with anyone responsible for bringing it about. Just looking at an HDMI cable and thinking about the effort poured into _restricting individual freedom_ throughout every layer of our infrastructure makes me feel an awesome, terrible fear. Nevertheless, here we are.

With that said, I'd like to suggest that bucketing WEI as "DRM for the web" misses the point, and that taking the proposal at face value does actually lead to a much more interesting and relevant discussion. The reality is that Google could kill ad blocking at any time via any number of means, and they wouldn't have to be sneaky about it, they literally control the web.

The real story here begins with Cloudflare, which mediates a huge fraction of the web today. In isolation, "DDoS protection" and "a fast global CDN" sound like normal, uncontroversial services for a company to offer. But the result is that trying to browse the web on a VPN, via Tor, or with anything generally out-of-the-ordinary in your network setup is likely to trap you in CloudFlare captcha hell on half the sites you try to visit.

How does CloudFlare decide whether to serve you captchas or not? The details aren't public, but it's a complicated amalgamation of heuristics that include IP address, browser user agent, and any other signals they can access. They're naturally incentivized to tap into as many signals as they can, even those that would be derided as "browser fingerprinting" if ad platforms did them.

Trying to surf a locked-down internet on a VPN is a real loss-of-innocence moment. It turns out the openness of the web has some caveats; CloudFlare wants to know a fair bit _about you_ before serving you any content. But this was neither built into the infrastructure nor schemed up as an evil takeover; it evolved as a natural confluence of business decisions. CloudFlare saves its clients money by filtering out requests that don't look like normal humans doing normal human things, and something like twenty percent of the web decided that was worth paying for.

That's the landscape that birthed the Web Environment Integrity API. It's awkward for everyone to involve captchas, and they might not even work for much longer if AI can solve them reliably. CloudFlare doesn't want to make you miserable, or even particularly want know fine-grained details about you and your device, it just wants to broadly know if you're a normal human doing normal human things, since that's what they promised their clients. The WEI pitch is to just make an API that provides exactly that and nothing more: an attestation that a request originates from a "trusted" environment, with a very low-entropy signal of trust that can't be used to fingerprint individuals.

For what it's worth, I believe that the authors of the spec are sincerely trying to improve the status quo, and probably have "user privacy" as a geniune goal. But somehow those good intentions trickle down the incentive landscape into something that is not-incorrectly characterized as "DRM for the web".
