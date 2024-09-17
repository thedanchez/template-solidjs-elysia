import { treaty } from "@elysiajs/eden";

import type { Server } from "../backend/server";

const serverClient = treaty<Server>(window.location.origin);

export default serverClient;
