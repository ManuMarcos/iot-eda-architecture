import React from 'react';
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';


export default function KPICard({typeSensor, typeUnit, value}:{typeSensor?:string, typeUnit?:string, value?:number}) {
  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
      <p style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '8px' }}>{Number(value).toFixed(2)} {typeUnit}</p>
      {typeSensor === "water" ? (
        <Image src="/water_icon.png" alt="Water Drop" width={40} height={40} />
      ) : typeSensor === "energy" ? (
        <Image src="/energy_icon.png" alt="Electricity Bolt" width={40} height={40} />
      ) : typeSensor === "air" ? (
        <Image src="/co2_icon.png" alt="Gas Flame" width={40} height={40} />
      ) : null}
    </div>
  );
};

