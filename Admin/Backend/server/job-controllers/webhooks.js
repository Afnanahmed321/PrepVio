// import { Webhook } from "svix";
// import User from "../job-models/User.js";

// export const clerkWebhooks = async (req, res) => {
//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // Verify webhook signature
//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });

//     const { data, type } = req.body;

//     switch (type) {
//       case "user.created":
//         await User.create({
//           _id: data.id,
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           email: data.email_addresses[0].email_address,
//           image: data.image_url,
//           resume: "",
//         });
//         break;

//       case "user.updated":
//         await User.findByIdAndUpdate(data.id, {
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           email: data.email_addresses[0].email_address,
//           image: data.image_url,
//         });
//         break;

//       case "user.deleted":
//         await User.findByIdAndDelete(data.id);
//         break;

//       default:
//         break;
//     }

//     res.json({});
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
