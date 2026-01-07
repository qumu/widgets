import { JSX } from 'preact';

type IconProps = JSX.IntrinsicElements['svg'] & {
  name: string;
  prefix?: string;
};

export default function Icon({
  name,
  prefix = 'icon',
  ...props
}: IconProps) {
  const symbolId = `#${prefix}-${name}`
  const classes = props.class ? ['qc-icon', props.class] : ['qc-icon'];

  return (
    <svg class={classes.join(' ')} {...props} aria-hidden="true">
      <use href={symbolId}/>
    </svg>
  )
}
