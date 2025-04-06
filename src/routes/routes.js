import app from "../app.js";
import { register } from "../controllers/auth.js";
import { isPatchType, PatchTypes } from "../controllers/user.js";
import { verifyTokens } from "../middlewares/auth.js";
import { conditionals, requireParams } from "../middlewares/index.js";

/**
 * @description
 * Handles all endpoints and routes
 */

app.get("/ping", (req,res) => {
    return res.status(200).send("server is healthy");
});

app.route("/user")
.post(
    requireParams("firstName","lastName","email","password","phone"),
    register()
)
.patch(
    verifyTokens(),
    requireParams("patchType"),
    ...Object.entries(PatchTypes).map(([type,{ requiredParams,handler }]) => {
        return conditionals([requireParams(...requiredParams),handler],isPatchType(type));
    })
);