import { authMiddleware } from '@clerk/nextjs/server'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/about',
    '/resources',
    '/impact',
    '/course',
    '/bootcamp',
    '/contact',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
