import * as utils from "./utils";

export default function scm(request) {
    return {
        info: function info(cb) {
            var options = {
                uri: "/api/scm/info",
                json: true
            };

            request(options, utils.createCallback("getting information about the repository", cb));
        },

        clean: function clean(cb) {
            request.post("/api/scm/clean", utils.createCallback("cleaning the repository", cb));
        },

        del: function del(cb) {
            request.del("/api/scm", utils.createCallback("deleting the repository", cb));
        }
    };
}
