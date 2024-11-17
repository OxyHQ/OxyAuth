import React from 'react';

type UserGrowthProps = {
  growthPercentage: number;
};

const UserGrowth: React.FC<UserGrowthProps> = ({ growthPercentage }) => {
  return (
    <div className="info-card">
      <h3>User Growth</h3>
      <p>{growthPercentage.toFixed(1)}%</p>
    </div>
  );
};

export default UserGrowth;
