const PERMISSIONS = {
    guest: {
        create: [],
        reply: [],
        view: ["discussion"]
    },

    user: {
        create: ["discussion", "support"],
        reply: ["discussion", "support"],
        view: ["discussion", "support"]
    },

    support: {
        create: ["discussion"],
        reply: ["discussion", "support"],
        view: ["discussion", "support"]
    },

    appeal: {
        create: ["discussion"],
        reply: ["discussion", "appeal"],
        view: ["discussion", "appeal"]
    },

    admin: {
        create: ["discussion", "support", "application", "appeal"],
        reply: ["discussion", "support", "application", "appeal"],
        view: ["discussion", "support", "application", "appeal"]
    }
};
