import * as React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { Banner } from 'components/Banner';
import { Nav } from 'components/Nav';
import { Sidebar } from 'components/Sidebar';
import { SidebarCategory } from 'components/SidebarCategory';
import { SidebarHeading } from 'components/SidebarHeading';
import { SidebarMobile } from 'components/SidebarMobile';
import { SidebarPost } from 'components/SidebarPost';
import { Sticky } from 'components/Sticky';
import { useIsMobile } from 'components/useIsMobile';
import { findRouteByPath } from 'lib/docs/findRouteByPath';
import { addTagToSlug, getSlug, removeFromLast } from 'lib/docs/utils';
import { getRouteContext } from 'lib/get-route-context';
import { Page, RouteItem } from 'lib/types';
import { useRouter } from 'next/router';
import { Toc } from './Toc';
import CodeBlock from './CodeBlock';
import s from './markdown.module.css';
import { Footer } from './Footer';
import { DocsPageFooter } from './DocsPageFooter';
import { Seo } from './Seo';
import MDXComponents from './MDXComponents';
import manifest from './manifest.json';

interface DocsProps {
  page: Page;
  routes: RouteItem[];
  route: RouteItem;
  meta?: any;
}

export const LayoutDocs: React.FC<DocsProps> = props => {
  const router = useRouter();
  const routes = manifest.routes;
  const _route = findRouteByPath(router.asPath, routes);
  // @ts-ignore
  const isMobile = useIsMobile();
  const { route, prevRoute, nextRoute } = getRouteContext(_route, routes);
  const title = route && `${route.title} | Formik`;
  return (
    <>
      <div>
        {isMobile ? (
          <Nav />
        ) : (
          <Sticky>
            <Nav />
          </Sticky>
        )}
        <Seo
          title={title || props.meta.title}
          description={props.meta.description}
        />
        <div className="block">
          <>
            <Sticky shadow>
              <SidebarMobile>
                <SidebarRoutes isMobile={true} routes={routes} />
              </SidebarMobile>
            </Sticky>
            <div className="container mx-auto pb-12 pt-6 content">
              <div className="flex relative">
                <Sidebar fixed>
                  <SidebarRoutes routes={routes} />
                </Sidebar>
                <div className={s['markdown'] + ' w-full'}>
                  <h1>{props.meta.title}</h1>
                  <MDXProvider components={MDXComponents}>
                    {props.children}
                  </MDXProvider>
                  <DocsPageFooter
                    href={route?.path || ''}
                    route={route!}
                    prevRoute={prevRoute}
                    nextRoute={nextRoute}
                  />
                </div>
                <div
                  className="hidden xl:block ml-10 flex-shrink-0"
                  style={{ width: 200 }}
                >
                  <div className="sticky top-24 ">
                    <h4 className="font-semibold uppercase text-sm mb-2 mt-2 text-gray-500">
                      On this page
                    </h4>
                    <Toc />
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
      <Footer />
    </>
  );
};

function getCategoryPath(routes: RouteItem[]) {
  const route = routes.find(r => r.path);
  return route && removeFromLast(route.path!, '/');
}

function SidebarRoutes({
  isMobile,
  routes: currentRoutes,
  level = 1,
}: {
  isMobile?: boolean;
  routes: RouteItem[];
  level?: number;
}) {
  const { asPath, query } = useRouter();
  let tag: any;
  let slug = removeFromLast(asPath, '.');
  return (currentRoutes as RouteItem[]).map(
    ({ path, title, routes, heading, open }) => {
      if (routes) {
        const pathname = getCategoryPath(routes);

        const selected = slug.startsWith(pathname as any);

        const opened = selected || isMobile ? false : open;

        if (heading) {
          return (
            <SidebarHeading key={pathname} title={title}>
              <SidebarRoutes
                isMobile={isMobile}
                routes={routes}
                level={level + 1}
              />
            </SidebarHeading>
          );
        }

        return (
          <SidebarCategory
            key={pathname}
            isMobile={isMobile}
            level={level}
            title={title}
            selected={selected}
            opened={opened}
          >
            <SidebarRoutes
              isMobile={isMobile}
              routes={routes}
              level={level + 1}
            />
          </SidebarCategory>
        );
      }

      const href = path!;
      const pagePath = removeFromLast(path!, '.');
      const pathname = addTagToSlug(pagePath, tag!);

      const selected = slug.startsWith(pagePath);
      const route = { href, path, title, pathname, selected };

      return (
        <SidebarPost
          key={title}
          isMobile={isMobile}
          level={level}
          route={route}
        />
      );
    }
  ) as any;
}

LayoutDocs.displayName = 'LayoutDocs';
