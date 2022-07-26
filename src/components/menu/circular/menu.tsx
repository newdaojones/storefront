import React, { useEffect, useRef, useState } from 'react';
import { TweenMax } from 'gsap';
import { useHistory, useLocation } from 'react-router-dom';

import { IMenuItem } from '../../../models';
import { MenuLine } from './menuLine';

interface Props {
    size: number;
    onDisconnect?: () => void;
    onFocused?: () => void;
    focused: boolean;
    items: IMenuItem[];
    disabled?: boolean;
    parentItem?: IMenuItem;
    ensName?: string;
    zIndex: number;
}

const itemSize = 30;
const beta = Math.PI * 2;
const DEG2RAD = Math.PI / 180;

export const MenuItem = ({ size, parentItem, onFocused = () => {}, focused, items, disabled = false, zIndex }: Props) => {
    const ref = useRef<any>();
    const location = useLocation();
    const history = useHistory();

    const [current, setCurrent] = useState(0);
    const [itemsTemp, setItemsTemp] = useState<IMenuItem[]>([]);
    const [centerX, setCenterX] = useState(0);
    const [centerY, setCenterY] = useState(0);
    const [isStartDrag, setStartDrag] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hovered, setHovered] = useState(false);

    const currentItem = itemsTemp[current];

    const renderItems = (item: IMenuItem, index: number) => {
        const itemWidth = item.text ? 100 : itemSize;
        const alpha = (beta / itemsTemp.length) * (index + 1) + offset + Math.PI / 40;
        const left = (Math.cos(alpha) * size) / 2 + size / 2 - itemWidth / 2 - itemWidth / 10;
        const top = (Math.sin(alpha) * size) / 2 + size / 2 - itemSize / 2 - itemSize / 10;

        const delta = alpha < 0 ? Math.PI * 2 + (alpha % (Math.PI * 2)) : alpha % (Math.PI * 2);
        const isVisible = (delta > 0 && delta < 115 * DEG2RAD) || delta > 340 * DEG2RAD;

        return (
            <div
                className="items-center justify-center text-center absolute select-none whitespace-pre-wrap cursor-pointer"
                onClick={() => moveToIndex(index)}
                style={{
                    width: itemWidth,
                    height: itemSize,
                    filter: index === current ? 'drop-shadow(0px 1px 5px #ffffff)' : 'none',
                    display: isVisible ? 'flex' : 'none',
                    zIndex: index + 1,
                    left,
                    top,
                }}
            >
                {item.icon && <img src={item.icon} alt={item.route} key={index} draggable={false} />}
                {item.text && <div className="text-white border-1 rounded-md bg-primary px-2 py-1">{item.text}</div>}
            </div>
        );
    };

    const onStartMove = (e: any) => {
        e.stopPropagation();
        if (disabled) {
            return;
        }

        setStartDrag(true);
        onFocused();
        const x = e.clientX - centerX || 0.000001;
        const y = e.clientY - centerY;
        let alpha = Math.atan(y / x);
        if (x < 0) {
            alpha = -(Math.PI - alpha);
        }

        setStartAngle(alpha - offset);
    };

    const onMove = (e: any) => {
        e.stopPropagation();
        if (!isStartDrag) {
            return;
        }

        const x = e.clientX - centerX || 0.000001;
        const y = e.clientY - centerY;
        let alpha = Math.atan(y / x);

        if (x < 0) {
            alpha = -(Math.PI - alpha);
        }

        setOffset(-startAngle + alpha);
    };

    const onEndMove = (e: any) => {
        // e.stopPropagation();
        setStartDrag(false);
        const index = getIndexByAngle(offset);
        moveToIndex(index);
    };

    const onMouseOver = () => {
        setHovered(true);
    };

    const onMouseOut = () => {
        setHovered(false);
    };

    const moveToIndex = (index: number) => {
        const beta = (itemsTemp.length - index) * ((Math.PI * 2) / itemsTemp.length);
        moveTo(beta);
        setCurrent(index);
        const parentPath = parentItem ? parentItem.route : '';
        history.push(parentPath + itemsTemp[index].route);
    };

    const moveTo = (beta: number, time?: number) => {
        const delta = getDeltaDiff(offset, beta);
        const angle = { x: offset };

        TweenMax.to(angle, time ?? 0.3, {
            x: offset + delta,
            onUpdate: () => {
                setOffset(angle.x);
            },
        });
    };

    const getIndexByAngle = (raw: number) => {
        const alpha = raw < 0 ? Math.PI * 2 + (raw % (Math.PI * 2)) : raw % (Math.PI * 2);
        const unit = (Math.PI * 2) / itemsTemp.length;
        const init = itemsTemp.length - Math.round(alpha / unit);
        return init > itemsTemp.length - 1 ? 0 : init;
    };

    const getDeltaDiff = (alpha: number, beta: number) => {
        const raw = beta - alpha;
        const delta = raw < 0 ? Math.PI * 2 + (raw % (Math.PI * 2)) : raw % (Math.PI * 2);
        return delta > Math.PI ? -(Math.PI * 2 - delta) : delta;
    };

    const onNext = () => {
        const next = current + 1 >= itemsTemp.length ? 0 : current + 1;
        moveToIndex(next);
    };

    const onPrevious = () => {
        const previous = current - 1 < 0 ? itemsTemp.length - 1 : current - 1;
        moveToIndex(previous);
    };

    useEffect(() => {
        if (ref) {
            const client = ref.current.getBoundingClientRect();
            setCenterX(client.x + size / 2);
            setCenterY(client.y + size / 2);
        }
    }, [ref, size]);

    const onKeydown = (e: KeyboardEvent) => {
        if (disabled) {
            return;
        }

        if (currentItem?.subItems?.length) {
            return;
        }

        if (e.code === 'ArrowLeft' && focused) {
            return onPrevious();
        }

        if (e.code === 'ArrowRight' && focused) {
            return onNext();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [current, offset, focused, itemsTemp, disabled, onKeydown]);

    useEffect(() => {
        const temp = [1, 2, 3]
            .map(t => items)
            .reduce((d: any[], item: any[]) => {
                return d.concat(item);
            }, []);

        setItemsTemp(temp);
    }, [items]);

    useEffect(() => {
        const parentPath = parentItem ? parentItem.route : '';
        const index = items.findIndex(item => location.pathname.startsWith(parentPath + item.route));
        if (!disabled && itemsTemp.length && index > 0 && location.pathname !== parentPath + itemsTemp[index].route) {
            moveToIndex(index);
        }
    }, [parentItem, itemsTemp, location, disabled]);

    return (
        <div
            ref={ref}
            onMouseUp={onEndMove}
            onMouseDown={onStartMove}
            onMouseMove={onMove}
            onMouseLeave={onEndMove}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            className="flex items-center justify-center"
            style={{
                width: size,
                minWidth: size,
                height: size,
                minHeight: size,
                position: 'absolute',
                zIndex: isStartDrag ? 1000 : 1000 - zIndex,
            }}
        >
            <MenuLine size={size} />
            {!disabled && itemsTemp.map((item: IMenuItem, index: number) => renderItems(item, index))}
            {currentItem?.subItems?.length && (
                <MenuItem
                    focused={focused}
                    onFocused={onFocused}
                    zIndex={hovered ? 1001 : zIndex + 1}
                    items={currentItem.subItems}
                    parentItem={currentItem}
                    size={size + 150}
                />
            )}
        </div>
    );
};
