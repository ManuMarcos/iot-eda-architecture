import React from 'react';
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';


export default function AlertCard({field, value}:{field?:string, value?:string}) {
  return (
    <div style={{ width: '300px', padding: '16px', border: '1px solid #ccc', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
      <Image src="/alert_icon.png" alt="Alert Icon" width={45} height={45} />
      <b style={{ fontSize: '24px', fontWeight: 'bold' }}>Sede {field}</b><br></br>
      <p><b style={{ fontWeight: 'bold', fontSize: '32px' }}>{value}</b> alertas</p>
    </div>
  );
};

