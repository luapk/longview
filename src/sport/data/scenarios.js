// Scenarios are constructed from driver combinations once drivers are named.
// Each scenario picks 2 drivers (dv) as critical uncertainties and builds an
// internally consistent 2036 narrative.
// Schema:
//   { id, ti (tier: Probable | Deep | Cassandra), dv (driver ids),
//     tt (title), tl (tagline), dp (dispatch — long narrative),
//     ss (shadow side), ka (killer assumption),
//     dm: { d (discoverability), a (appeal), r (relevance), v (availability) } }

export const SC = [];
