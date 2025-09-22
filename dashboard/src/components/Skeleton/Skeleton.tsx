"use client"

import type React from "react"

interface PureSkeletonProps {
  width?: string
  height?: string
  variant?: "shimmer" | "pulse"
  borderRadius?: string
  style?: React.CSSProperties
}

export function PureSkeleton({
  width = "100%",
  height = "16px",
  variant = "shimmer",
  borderRadius = "8px",
  style = {},
}: PureSkeletonProps) {
  const skeletonStyle: React.CSSProperties = {
    width,
    height,
    borderRadius,
    ...style,
    ...(variant === "shimmer"
      ? {
          background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
          backgroundSize: "400px 100%",
          animation: "skeleton-shimmer 1.5s infinite linear",
        }
      : {
          backgroundColor: "#e2e8f0",
          animation: "skeleton-pulse 1.5s ease-in-out infinite",
        }),
  }

  return <div style={skeletonStyle} />
}

export function PureSkeletonCard({
  children,
  style = {},
}: {
  children?: React.ReactNode
  style?: React.CSSProperties
}) {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    ...style,
  }

  return <div style={cardStyle}>{children}</div>
}

export function PureChartSkeleton({ type = "line" }: { type?: "line" | "bar" | "area" }) {
  const chartContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "200px",
    position: "relative",
    display: "flex",
    alignItems: "end",
    gap: "4px",
    padding: "16px",
  }

  if (type === "bar") {
    return (
      <div style={chartContainerStyle}>
        {[...Array(12)].map((_, i) => (
          <PureSkeleton key={i} width="20px" height={`0px`} borderRadius="4px 4px 0 0" />
        ))}
      </div>
    )
  }

  if (type === "area") {
    return (
      <div style={{ ...chartContainerStyle, alignItems: "center" }}>
        <PureSkeleton width="100%" height="120px" borderRadius="8px" />
      </div>
    )
  }

  return (
    <div style={{ ...chartContainerStyle, alignItems: "center" }}>
      <PureSkeleton width="100%" height="2px" borderRadius="1px" />
    </div>
  )
}

export function PureKPISkeleton() {
  const kpiStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  }

  const iconStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
  }

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  }

  return (
    <div style={kpiStyle}>
      <PureSkeleton style={iconStyle} />
      <div style={contentStyle}>
        <PureSkeleton width="80px" height="24px" />
        <PureSkeleton width="60px" height="14px" />
      </div>
    </div>
  )
}

export function PureDashboardSkeleton() {
  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "24px",
  }

  const maxWidthStyle: React.CSSProperties = {
    maxWidth: "1280px",
    margin: "0 auto",
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  }

  const kpiGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  }

  const spaceYStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthStyle}>
        <div style={headerStyle}>
          <div style={spaceYStyle}>
            <PureSkeleton width="240px" height="32px" />
            <PureSkeleton width="180px" height="16px" />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <PureSkeleton width="120px" height="40px" borderRadius="8px" />
            <PureSkeleton width="100px" height="40px" borderRadius="8px" />
          </div>
        </div>

        <div style={kpiGridStyle}>
          {[...Array(4)].map((_, i) => (
            <PureSkeletonCard key={i}>
              <PureKPISkeleton />
            </PureSkeletonCard>
          ))}
        </div>

        <div style={{ marginBottom: "24px" }}>
          <PureSkeletonCard>
            <div style={spaceYStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <PureSkeleton width="160px" height="24px" />
                <div style={{ display: "flex", gap: "8px" }}>
                  <PureSkeleton width="80px" height="32px" borderRadius="6px" />
                  <PureSkeleton width="80px" height="32px" borderRadius="6px" />
                </div>
              </div>
              <PureChartSkeleton type="line" />
            </div>
          </PureSkeletonCard>
        </div>

        <div style={gridStyle}>
          <PureSkeletonCard>
            <div style={spaceYStyle}>
              <PureSkeleton width="140px" height="20px" />
              <PureChartSkeleton type="area" />
            </div>
          </PureSkeletonCard>

          <PureSkeletonCard>
            <div style={spaceYStyle}>
              <PureSkeleton width="180px" height="20px" />
              <PureChartSkeleton type="bar" />
            </div>
          </PureSkeletonCard>
        </div>

        <div style={gridStyle}>
          <PureSkeletonCard>
            <div style={spaceYStyle}>
              <PureSkeleton width="100px" height="20px" />
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <PureSkeleton width="24px" height="24px" borderRadius="50%" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                    <PureSkeleton width="120px" height="16px" />
                    <PureSkeleton width="80px" height="12px" />
                  </div>
                  <PureSkeleton width="60px" height="24px" borderRadius="12px" />
                </div>
              ))}
            </div>
          </PureSkeletonCard>

          <PureSkeletonCard>
            <div style={spaceYStyle}>
              <PureSkeleton width="120px" height="20px" />
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <PureSkeleton width="100px" height="16px" />
                  <PureSkeleton width="60px" height="16px" />
                  <PureSkeleton width="40px" height="16px" />
                </div>
              ))}
            </div>
          </PureSkeletonCard>
        </div>
      </div>

      <style jsx>{`
        @keyframes skeleton-shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: calc(400px + 100%) 0;
          }
        }

        @keyframes skeleton-pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
