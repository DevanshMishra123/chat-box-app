export { default } from "next-auth/middleware";

export const config = {
  matcher: ['/dashboard'],  
};
/*import { NextResponse } from 'next/server';

export function middleware(req) {
  const authToken = req.cookies.get('auth_token');  
  if (!authToken && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/'],  
};
*/

/*import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin", 
  },
});

export const config = {
  matcher: ["/","/protected"], 
};
*/
