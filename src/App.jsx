import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import * as d3 from 'd3'

export function App() {

  //https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
  

  function convertYearToDec(date) {
    //takes string in format yyyy-mm-dd
    let arr = date.split('-');
    let y = parseInt(arr[0]);
    let m = parseInt(arr[1]);
    let d = parseInt(arr[2]);
    
    let year = y + ( (d + m * 30) / 365 );
    
    //returns a decimal in form yyyy.....
    console.log(year)
    return year
  }

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


  function renderChart(json) {

    const data = json["data"]
    const dataMin = d3.min(json["data"], (d) => d[1])
    const dataMax = d3.max(json["data"], (d) => d[1])
    const dates = json.data.map( e => new Date(e[0]) )
    
    const dataLength = json["data"].length
    const name = json["source_name"]
    const XYaxesLabels = json["column_names"]
    const padding = 40
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
    .append("title")
    .text((d)=>"DATE: "+d[0]+", GDP: "+d[1]+"")

    console.log(parseInt(data[0][0]))

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

    const tooltip = d3.select("#chart-container")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "gray")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .html("<div><p>I am the tool tip</p></div>")
  
  }



  return (
    <div className="App">
      <h1 id="title"></h1>
      <div id="chart-container"></div>
      <div id="json"></div>
    </div>
  )
}

export default App
