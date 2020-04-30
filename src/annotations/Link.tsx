/**
 * A React component to view a PDF document
 *
 * @see https://react-pdf-viewer.dev
 * @license https://react-pdf-viewer.dev/license
 * @copyright 2019-2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import React, { useContext } from 'react';

import SpecialZoomLevel from '../SpecialZoomLevel';
import ThemeContent from '../theme/ThemeContext';
import getDestination from '../utils/getDestination';
import PdfJs from '../vendors/PdfJs';
import Annotation from './Annotation';
import './link.less';

interface LinkProps {
    annotation: PdfJs.Annotation;
    doc: PdfJs.PdfDocument;
    page: PdfJs.Page;
    viewport: PdfJs.ViewPort;
    onExecuteNamedAction(action: string): void;
    onJumpToDest(pageIndex: number, bottomOffset: number, scaleTo: number | SpecialZoomLevel): void;
}

const Link: React.FC<LinkProps> = ({ annotation, doc, page, viewport, onExecuteNamedAction, onJumpToDest }) => {
    const theme = useContext(ThemeContent);
    const { dest } = annotation;
    const href = annotation.action
        ? ''
        : (typeof dest === 'string') ? `#${escape(dest)}` : `#${escape(JSON.stringify(dest))}`;

    const link = (e: React.MouseEvent): void => {
        e.preventDefault();
        annotation.action
            ? onExecuteNamedAction(annotation.action)
            : getDestination(doc, dest).then((target) => {
                const { pageIndex, bottomOffset, scaleTo } = target;
                onJumpToDest(pageIndex + 1, bottomOffset, scaleTo);
            });
    };

    const isRenderable = !!(annotation.url || annotation.dest || annotation.action);
    console.log(annotation);

    return (
        <Annotation annotation={annotation} hasPopup={false} ignoreBorder={false} isRenderable={isRenderable} page={page} viewport={viewport}>
            {(props): React.ReactElement => (
                <div
                    {...props.slot.attrs}
                    data-annotation-id={annotation.id}
                >
                    <a
                        className={`${theme.prefixClass}-annotation-link`}
                        {...(href && {href})}
                        onClick={link}
                    />
                </div>
            )}
        </Annotation>
    );
};

export default Link;