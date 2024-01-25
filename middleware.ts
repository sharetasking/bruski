import { withAuth } from "next-auth/middleware"

export default withAuth

// specify the path(s) to protect
export const config = {
  matcher: ["/pixi", "/home"]
}

// Omit others and use this line if you want to protect everything
// export { default } from "next-auth/middleware"


// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };