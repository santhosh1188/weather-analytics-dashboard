import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUnit } from '../redux/unitsSlice';
import { RootState } from '../redux/store';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const unit = useSelector((state: RootState) => state.units.unit);

  return (
    <div className="settings">
      <button onClick={() => dispatch(toggleUnit())}>
        Switch to {unit === 'C' ? '°F' : '°C'}
      </button>
    </div>
  );
};

export default Settings;