// Utils
import { createNamespace } from '../utils';
import { emit, inherit } from '../utils/functional';

// Components
import Icon from '../icon';
import Button, { ButtonType } from '../button';

// Types
import { CreateElement, RenderContext } from 'vue/types';
import { ScopedSlot, DefaultSlots } from '../utils/types';

export type SubmitBarProps = {
  tip?: string;
  tipIcon?: string;
  label?: string;
  price?: number;
  priceOld?: number;
  loading?: boolean;
  currency: string;
  disabled?: boolean;
  buttonType: ButtonType;
  buttonText?: string;
  buttonColor?: string;
  suffixLabel?: string;
  decimalLength: number;
  safeAreaInsetBottom?: boolean;
  textAlign?: 'right' | 'left';
};

export type SubmitBarSlots = DefaultSlots & {
  top?: ScopedSlot;
  tip?: ScopedSlot;
};

const [createComponent, bem, t] = createNamespace('submit-bar');

function SubmitBar(
  h: CreateElement,
  props: SubmitBarProps,
  slots: SubmitBarSlots,
  ctx: RenderContext<SubmitBarProps>
) {
  const { tip, price, priceOld, tipIcon } = props;

  function Text() {
    if (typeof price === 'number' && typeof priceOld === 'number') {
      const priceArr = (price / 100).toFixed(props.decimalLength).split('.');
      // const decimalStr = props.decimalLength ? `.${priceArr[1]}` : '';
      const priceOldArr = (priceOld / 100).toFixed(props.decimalLength).split('.');
      return (
        <div
          style={{ textAlign: props.textAlign ? props.textAlign : '' }}
          class={bem('text')}
        >
          {/* <span>{props.label || t('label')}</span> */}
          <span class={bem('price')}>
            <span class={bem('price', 'currency')}>{props.currency}</span>
            <span class={bem('price', 'integer')}>{priceArr[0]}</span>
            {/* {decimalStr} */}
          </span>
          <span class={bem('price-old')}>
          <span class={bem('price-old', 'prefix')}>原价</span>
            <span class={bem('price-old', 'currency')}>{props.currency}</span>
            <span class={bem('price-old', 'integer')}>{priceOldArr[0]}</span>
            {/* {decimalStr} */}
          </span>
          {props.suffixLabel && (
            <span class={bem('suffix-label')}>{props.suffixLabel}</span>
          )}
        </div>
      );
    }
  }

  function Tip() {
    if (slots.tip || tip) {
      return (
        <div class={bem('tip')}>
          {tipIcon && <Icon class={bem('tip-icon')} name={tipIcon} />}
          {tip && <span class={bem('tip-text')}>{tip}</span>}
          {slots.tip && slots.tip()}
        </div>
      );
    }
  }

  return (
    <div class={bem({ unfit: !props.safeAreaInsetBottom })} {...inherit(ctx)}>
      {slots.top && slots.top()}
      {Tip()}
      <div class={bem('bar')}>
        {slots.default && slots.default()}
        {Text()}
        <Button
          round
          class={bem('button', props.buttonType)}
          type={props.buttonType}
          color={props.buttonColor}
          loading={props.loading}
          disabled={props.disabled}
          text={props.loading ? '' : props.buttonText}
          onClick={() => {
            emit(ctx, 'submit');
          }}
        />
      </div>
    </div>
  );
}

SubmitBar.props = {
  tip: String,
  label: String,
  price: Number,
  priceOld: Number,
  tipIcon: String,
  loading: Boolean,
  disabled: Boolean,
  textAlign: String,
  buttonText: String,
  buttonColor: String,
  suffixLabel: String,
  safeAreaInsetBottom: {
    type: Boolean,
    default: true,
  },
  decimalLength: {
    type: [Number, String],
    default: 2,
  },
  currency: {
    type: String,
    default: '¥',
  },
  buttonType: {
    type: String,
    default: 'info',
  },
};

export default createComponent<SubmitBarProps, {}, SubmitBarSlots>(SubmitBar);
