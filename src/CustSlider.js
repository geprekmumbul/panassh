import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

export default function CustSlider({ onChange }){
    return (
        <Slider
          range = {true}
          min={1900}
          max={2013}
          defaultValue={1900}
          step={1}
          onChange={onChange}
          ariaLabelForHandle={"test"}
        />
    );
}