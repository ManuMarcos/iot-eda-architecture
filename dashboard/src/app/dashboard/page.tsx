'use client'
import AlertCard from "@/components/Alerts/AlertCard";
import { MyDatePicker } from "@/components/DatePicker/DatePicker";
import HistogramGraph from "@/components/Histogram/HistogramGraph";
import KPICard from "@/components/KPI/KPICard";
import { PureDashboardSkeleton } from "@/components/Skeleton/Skeleton";
import TotalGraph from "@/components/Totals/TotalGraph";
import "@/components/Trend/TrendGraph"
import TrendGraph from "@/components/Trend/TrendGraph";
import { set } from "date-fns";
import { da } from "date-fns/locale";
import { useEffect, useState } from "react";

export default function Page() {

  const [historicalData, setHistoricalData] = useState(null);
  const [periodoKPI, setPeriodoKPI] = useState<number>(new Date().getFullYear());
  const [dataTrend, setDataTrend] = useState<any[]>([]);
  const [dataTotals, setDataTotals] = useState<any[]>([]);
  const [dataHistogram, setDataHistogram] = useState<any[]>([]);
  const [dataAlerts, setDataAlerts] = useState<any[]>([]);
  const [email, setEmail] = useState<string>("");

  const handlePeriodoKPIChange = (newPeriodo: number) => {
    setPeriodoKPI(newPeriodo);
  }

  const handleSendReport = async () => {
    try {
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('Send report response:', data);
      if (data.previewUrl) {
        alert(`Reporte enviado! Puedes ver el email en: ${data.previewUrl}`);
      }
    } catch (error) {
      console.error('Error sending report:', error);
    }
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch('/api/historical');
        const data = await response.json();
        console.log('Historical data:', data);
        setHistoricalData(data);
        setDataTrend(data.filter((item: any) => item.type === 'trend'));
        setDataTotals(data.filter((item: any) => item.type === 'totals'));
        setDataHistogram(data.filter((item: any) => item.type === 'histogramavg'));
      }
      fetchData();
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchDataAlerts = async () => {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        console.log('Alerts data:', data);
        setDataAlerts(data);
      }
      fetchDataAlerts();
    } catch (error) {
      console.error('Error fetching alerts data:', error);
    }
  }, []);


  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conectado al WebSocket');
      ws.send(JSON.stringify({ type: 'hello', payload: 'Hola ws serverr!' }));
    };

    ws.onmessage = (event) => {
    // console.log('Mensaje recibido del WebSocket:', event.data);

    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch (error) {
      // console.warn('Mensaje recibido no es JSON válido:', event.data);
      return; // Salimos si no es JSON
    }

    // según el tipo, actualizás el estado correcto
    if (msg.type === 'trend') {
      setDataTrend((prev: any[]) => [...prev, msg]);
    } else if (msg.type === 'totals') {
      setDataTotals((prev: any[]) => [...prev, msg]);
    } else if (msg.type === 'histogramavg') {
      setDataHistogram((prev: any[]) => [...prev, msg]);
    } else if (msg.type === 'alert') {
      setDataAlerts((prev: any[]) => [...prev, msg]);
    }
  };

    ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket cerrado');
    };

    return () => ws.close();
  }, []);

  if (!dataTrend || !dataTotals || !dataHistogram || !dataAlerts) {
    return <PureDashboardSkeleton />;
  }

  return (
    <div><br></br><br></br>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>

            <TrendGraph data={dataTrend}/><br></br>

            <TotalGraph data={dataTotals}/>

        </div>
        <br></br><br></br>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>

          <HistogramGraph data={dataHistogram}/>

          <div style={{ width: '55%', maxWidth: '1200px', position: 'relative', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            {/* Alertas */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h1>Alertas</h1>
                </div>
                {!dataAlerts || dataAlerts === null ? <p>Cargando...</p> :
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                      <AlertCard 
                        field="junin"
                        value={dataAlerts.reduce((acc: any, item: any) => {
                        const itemYear = item.datetime.slice(0, 4);
                        return itemYear === new Date().getFullYear().toString() && "junin" === item.field ? acc + 1 : acc;
                      }, 0)}
                      />
                      <AlertCard 
                        field="mercedes"
                        value={dataAlerts.reduce((acc: any, item: any) => {
                        const itemYear = item.datetime.slice(0, 4); 
                        return itemYear === new Date().getFullYear().toString() && "mercedes" === item.field ? acc + 1 : acc;
                        }, 0)}
                      />
                      <AlertCard 
                        field="areco"
                        value={dataAlerts.reduce((acc: any, item: any) => {
                        const itemYear = item.datetime.slice(0, 4); 
                        return itemYear === new Date().getFullYear().toString() && "areco" === item.field ? acc + 1 : acc;
                      }, 0)}
                      />
                  </div>
                }
              </div>
            </div> <br></br>

            {/* KPIs */}
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '20px' }}>
              <div style={{ width: '100%', margin: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h1>KPI</h1>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', fontSize: '14px', color: '#666' }}>
                    <p style={{ cursor: 'pointer', color: 'black', fontWeight: 500, fontSize: '24px', borderRadius: '8px', border: '2px solid #CAFE16', padding: '10px', backgroundColor: (new Date().getFullYear() - 1) === periodoKPI ? '#CAFE16' : 'transparent' }} onClick={() => handlePeriodoKPIChange(new Date().getFullYear() - 1)}>{new Date().getFullYear() - 1}</p>
                    <p style={{ cursor: 'pointer', color: 'black', fontWeight: 500, fontSize: '24px', borderRadius: '8px', border: '2px solid #CAFE16', padding: '10px', backgroundColor: new Date().getFullYear() === periodoKPI ? '#CAFE16' : 'transparent' }} onClick={() => handlePeriodoKPIChange(new Date().getFullYear())}>{new Date().getFullYear()}</p>
                  </div>
                </div>
                  {!dataTotals || dataTotals === null ? <p>Cargando...</p> : 
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyContent: 'space-around' }}>
                      <KPICard 
                        typeSensor="water"
                        typeUnit="ml"
                        value={dataTotals.reduce((acc: any, item: any) => {
                          const itemYear = item.period.slice(0, 4); // "YYYY" de "2025-09"
                          return item.sensor === "water" && itemYear === periodoKPI.toString()
                            ? acc + Number(item.total)
                            : acc;
                        }, 0)}
                      />
                      <KPICard 
                        typeSensor="energy"
                        typeUnit="kWh"
                        value={dataTotals.reduce((acc: any, item: any) => {
                          const itemYear = item.period.slice(0, 4); // "YYYY" de "2025-09"
                          return item.sensor === "energy" && itemYear === periodoKPI.toString()
                            ? acc + Number(item.total)
                            : acc;
                        }, 0)}
                      />
                      <KPICard 
                        typeSensor="air"
                        typeUnit="ppm"
                        value={dataTotals.reduce((acc: any, item: any) => {
                          const itemYear = item.period.slice(0, 4); // "YYYY" de "2025-09"
                          return item.sensor === "air" && itemYear === periodoKPI.toString()
                            ? acc + Number(item.total)
                            : acc;
                        }, 0)}
                      />
                    </div>
                  }
              </div>
            </div>
          </div>
        </div>
        <br></br><br></br>
        {/* Envio de reporte */}
        {dataTrend && dataTotals && dataHistogram && dataAlerts && 
          <div style={{ display: 'flex', width: '55%', maxWidth: '1200px', position: 'relative', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', flexDirection: 'row', alignItems: 'center' }}>
            <h1>Enviar Reporte</h1>
            <input
              type="email"
              placeholder="Ingrese su email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '10px', marginLeft: '20px' }}
            />
            <p onClick={handleSendReport} style={{ padding: '10px 20px', backgroundColor: '#0A3345', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Enviar Reporte
            </p>
          </div>
        }
        
    </div>
  );
}
