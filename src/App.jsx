import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import * as d3 from 'd3'

export function App() {

  useEffect(()=>{
    const req = new XMLHttpRequest();
    req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
    req.send();
    req.onload = () => {
      const json = JSON.parse( req.responseText );
      const name = json.source_name

      d3.select("#title")
      .text(name)
      renderChart(json);
    }
  },[])

  function mouseoverHandler(d) {
    const dataPoint = d.toElement.__data__
    d3.select("#tooltip")
    .attr("data-date", dataPoint[0])
    .transition()
    .style("opacity", 1)
    .text("DATE: "+dataPoint[0]+' GDP: '+dataPoint[1])
  }
  function mousemoveHandler(e) {
    d3.select("#tooltip")
      .style("top", e.clientY-60+"px")
      .style("left", e.clientX-170+"px")
  }
  function mouseoutHandler () {
    d3.select("#tooltip")
    .transition()
    .style("opacity", 0)
  }


  function renderChart(json) {

    const data = json["data"]
    const dataMin = d3.min(json["data"], (d) => d[1])
    const dataMax = d3.max(json["data"], (d) => d[1])
    const dates = json.data.map( e => new Date(e[0]) )
    
    const dataLength = json["data"].length
    const name = json["source_name"]
    const XYaxesLabels = json["column_names"]
    const padding = 60
    const rW = 2.5
    const w = (padding * 2) + (dataLength * rW)
    const h = 400

    const xScale = d3.scaleTime()
      .domain([d3.min(dates), d3.max(dates)])
      .range([padding, w - padding])
    const yScale = d3.scaleLinear()
      .domain([0, dataMax])
      .range([padding, h - padding])
    

    d3.select(".App").selectAll("svg").remove()

    const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    
    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d)=>d[0])
    .attr("data-gdp", (d)=>d[1])
    .attr("width", rW)
    .attr("height", (d)=> yScale(d[1]) - padding)
    .attr("x", (d, i)=> padding + i * rW)
    .attr("y", (d)=> h - yScale(d[1]))
    .attr("fill", "whitesmoke")
    .on("mouseover", mouseoverHandler)
    .on("mousemove", mousemoveHandler)
    .on("mouseout", mouseoutHandler)
    
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
    .attr("id", "x-axis")
      .attr("transform", "translate(0, " + (h - padding) + ")")
      .call(xAxis)
    
    const yAxisScale = d3.scaleLinear()
    .domain([0, dataMax])
    .range([h-padding, padding])

    const yAxis = d3.axisLeft(yAxisScale);
    svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis)
    
    svg.append("text")
    .attr("fill", "whitesmoke")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("height", "1rem")
    .attr("x", - (h / 2 - padding))
    .attr("y", "0.75rem")
    .attr("transform", "rotate(-90)")
    .text("GDP in Billions")

  }



  return (
    <div className="App">
      <h1 id="title"></h1>
      <div id="tooltip">tooltip</div>
      <div id="chart-container"></div>
      <footer><span style={{"color": "gray"}}>created by</span><br/>Nathan Zucker</footer>
    </div>
  )
}

export default App
