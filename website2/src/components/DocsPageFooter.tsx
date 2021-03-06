import * as React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { getSlug, removeFromLast, addTagToSlug } from '../lib/docs/utils';
import { siteConfig } from 'siteConfig';
import { Page, RouteItem } from '../lib/types';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
import { TWButton } from './TWButton';

export interface DocsPageFooterProps {
  route: RouteItem;
  href: string;
  prevRoute?: RouteItem;
  nextRoute?: RouteItem;
}

function areEqual(prevProps: DocsPageFooterProps, props: DocsPageFooterProps) {
  return prevProps.route.path === props.route.path;
}

export const DocsPageFooter = React.memo<DocsPageFooterProps>(
  ({ route, href, prevRoute, nextRoute }) => {
    //  @todo versions
    // const { asPath } = useRouter();
    // const { tag, slug } = getSlug(query as { slug: string[] });

    const editUrl = `${siteConfig.editUrl}${route?.path}`;
    return (
      <>
        <div className="my-8">
          {/* @todo versions {asPath.includes('tag') ? (
            <NextLink href={href} as={slug}>
              <a className="text-gray-600 underline">
                Go to the live version of this page
              </a>
            </NextLink>
          ) : ( */}
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 underline"
          >
            Edit this page on GitHub
          </a>
          {/* )} */}
        </div>

        <div className="py-8 md:flex md:items-center md:py-8 border-t border-b">
          <div className="font-semibold text-xl mr-4 text-center mb-4 md:mb-0  md:text-left">
            Was this page helpful?
          </div>
          <div className="grid grid-cols-2 gap-3 w-auto max-w-xs mx-auto md:mx-2">
            <TWButton icon={<FiThumbsUp />}>Yes</TWButton>
            <TWButton icon={<FiThumbsDown />}>No</TWButton>
          </div>
        </div>

        <div className="py-12">
          <div className="flex space-between items-center">
            {prevRoute && prevRoute.path ? (
              <NextLink
                href={prevRoute.path}
                as={removeFromLast(prevRoute.path, '.')}
              >
                <a className="flex-grow  block">
                  <span className="text-sm block text-gray-500 mb-1 font-semibold">
                    Prev
                  </span>
                  <span className="text-xl block text-blue-600 font-semibold">
                    {prevRoute.title}
                  </span>
                </a>
              </NextLink>
            ) : (
              <div />
            )}
            {nextRoute && nextRoute.path && (
              <NextLink
                href={nextRoute.path}
                as={removeFromLast(nextRoute.path, '.')}
              >
                <a className="flex-grow text-right block">
                  <span className="text-sm block text-gray-500 mb-1 font-semibold">
                    Next
                  </span>
                  <span className="text-xl block text-blue-600 font-semibold">
                    {nextRoute.title}
                  </span>
                </a>
              </NextLink>
            )}
          </div>
        </div>
      </>
    );
  },
  areEqual
);

DocsPageFooter.displayName = 'DocsPageFooter';
