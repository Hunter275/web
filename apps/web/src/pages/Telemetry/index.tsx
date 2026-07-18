"use client";

import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useNodesAsProto } from "@core/hooks/useNodesAsProto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/UI/Select";
import { numberToHexUnpadded } from "@noble/curves/utils.js";

interface DataPoint {
  time: number;
  value: number;
}

const TelemetryChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Sample telemetry data
    const data: DataPoint[] = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: Math.sin(i * 0.3) * 50 + 50 + Math.random() * 10,
    }));

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.time) as [number, number])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value));

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Add line path
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.time))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", "steelblue");

    // Add X axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .text("Time");

    // Add Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Value");
  }, []);

  return <svg ref={svgRef} style={{ border: "1px solid #ccc" }} />;
};

const TelemetryPage = () => {
  const nodes = useNodesAsProto();
  const [selectedNode, setSelectedNode] = useState<string>("");

  useEffect(() => {
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(String(nodes[0].num));
    }
  }, [nodes, selectedNode]);

  return (
    <PageLayout label="Telemetry" actions={[]} leftBar={<Sidebar />}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Telemetry Data</h2>
        <div className="mb-6 max-w-xs">
          <label className="text-sm font-medium mb-2 block">Select Node</label>
          <Select value={selectedNode} onValueChange={setSelectedNode}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a node" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.num} value={String(node.num)}>
                  {node.user?.longName ||
                    "Meshtastic " +
                      numberToHexUnpadded(node.num).slice(-4).toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <TelemetryChart />
      </div>
    </PageLayout>
  );
};

export default TelemetryPage;
