const uuid = require('node-uuid');
// manageSession and parseCookies

function parseCookies(req, res, next){
	req.hwCookies = {};
	const c = req.headers.cookie;

	if (c !== undefined){
	const headers = c.split(';');
	headers.forEach(function (cookie){
		let pair = cookie.split("=");
		req.hwCookies[pair[0].trim()] = pair[1];
	});
}

	next();

}

const sessionStore = {};
function manageSession(req, res, next){
	req.hwSession = {};
	req.hwSession.sessionId = sessionStore["sessionId"];
	if (req.hwSession.sessionId !== undefined){
		req.hwSession = {"sessionId" : req.hwSession.sessionId};
		console.log("session already exists: ", req.hwSession.sessionId);
	}
	else{
		req.hwSession = {"sessionId" : uuid()};
		req.hwSession.sessionId = req.hwSession["sessionId"];
		sessionStore["sessionId"] = req.hwSession.sessionId;
		res.append("Set-Cookie", "MY_SESSION_ID=req.hwSession.sessionId; HttpOnly");
		console.log("session generated:", req.hwSession.sessionId);
	}

	next();

}


module.exports = {
	parseCookies: parseCookies,
	manageSession: manageSession
};