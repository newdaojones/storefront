import React, { useRef, useEffect, useState } from 'react';
import { TweenMax } from 'gsap';
import globeImage from '../../assets/images/globe.png';
import { IRoateItem } from '../../models';
const width = 800;
const height = 160;

const ASPECT = 0.5;

export const RotateView = ({ items, itemSize = 100 }: { items: IRoateItem[]; itemSize?: number }) => {
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);
  const [isStartDrag, setStartDrag] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [offset, setOffset] = useState(0);
  const ref = useRef<any>();

  const addPoints = (item: IRoateItem, index: number) => {
    const rHor = (width / 2) * (1 - ASPECT / 2);
    const rVer = height / 2;
    const alpha = ((Math.PI * 2) / items.length) * index + Math.PI / 2 + offset;
    const ratio = getRadiusRatioByAngle(alpha);
    const left = -(Math.cos(alpha) * rHor * ratio) + width / 2 - (itemSize * ratio) / 2;
    const top = Math.sin(alpha) * rVer * ratio + height / 2 - (itemSize * ratio) / 2;

    return (
      <div
        style={{
          width: itemSize * ratio,
          height: itemSize * ratio,
          background: item.background,
          borderRadius: '50%',
          position: 'absolute',
          display: 'flex',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          userSelect: 'none',
          zIndex: index + 1,
          left,
          top,
        }}
      >
        {item.text}
      </div>
    );
  };

  const getIndexByAngle = (raw: number) => {
    const alpha = raw < 0 ? Math.PI * 2 + (raw % (Math.PI * 2)) : raw % (Math.PI * 2);
    const unit = (Math.PI * 2) / items.length;
    const init = items.length - Math.round(alpha / unit);
    return init > items.length - 1 ? 0 : init;
  };

  const onStartMove = (e: any) => {
    console.log('onStartMove');
    setStartDrag(true);
    const x = e.clientX - centerX || 0.000001;
    const y = e.clientY - centerY;
    console.log(x, y);
    let alpha = Math.atan(y / x);
    if (x < 0) {
      alpha = -(Math.PI - alpha);
    }

    setStartAngle(alpha + offset);
    console.log('alpha', alpha, offset);
  };

  const onMove = (e: any) => {
    if (!isStartDrag) {
      return;
    }

    const x = e.clientX - centerX || 0.000001;
    const y = e.clientY - centerY;
    let alpha = Math.atan(y / x);

    if (x < 0) {
      alpha = -(Math.PI - alpha);
    }
    console.log('move alpha', alpha);

    setOffset(startAngle - alpha);
  };

  const onEndMove = () => {
    setStartDrag(false);
    const angle = { x: offset };
    const beta = (items.length - getIndexByAngle(offset)) * ((Math.PI * 2) / items.length);
    const delta = getDeltaDiff(offset, beta);

    TweenMax.to(angle, 0.3, {
      x: offset + delta,
      onUpdate: () => {
        setOffset(angle.x);
      },
    });
  };

  const getDeltaDiff = (alpha: number, beta: number) => {
    const raw = beta - alpha;
    const delta = raw < 0 ? Math.PI * 2 + (raw % (Math.PI * 2)) : raw % (Math.PI * 2);
    return delta > Math.PI ? -(Math.PI * 2 - delta) : delta;
  };

  const getRadiusRatioByAngle = (raw: number) => {
    const beta = Math.PI / 2; // nearest p
    const alpha = raw < 0 ? Math.PI * 2 + (raw % (Math.PI * 2)) : raw % (Math.PI * 2);
    const delta = alpha > (Math.PI * 3) / 2 ? Math.PI * 2 - alpha + Math.PI / 2 : alpha < Math.PI / 2 ? Math.PI / 2 - alpha : alpha - beta;
    return (1 - delta / Math.PI) * ASPECT + 1;
  };

  useEffect(() => {
    if (ref) {
      const client = ref.current.getBoundingClientRect();
      setCenterX(client.x + width / 2);
      setCenterY(client.y + height / 2);
    }
  }, []);
  return (
    <div
      onMouseUp={onEndMove}
      onMouseDown={onStartMove}
      onMouseMove={onMove}
      style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <img style={{ width: width + 300, position: 'absolute', userSelect: 'none' }} draggable={false} src={globeImage} alt="" />

      <div
        ref={ref}
        style={{
          width: width,
          height: (height / 2) * (2 + ASPECT),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {items.map((item, index) => addPoints(item, index))}
      </div>
    </div>
  );
};
