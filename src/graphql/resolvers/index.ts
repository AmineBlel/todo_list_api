import taskResolver from "./taskResolver";
import userResolver from "./userResolver";
import commentResolver from "./commentResolver";

// declare resolvers
const rootResolver = {
  ...taskResolver,
  ...userResolver,
  ...commentResolver,
};

export default rootResolver;
