const margin = {
        top: 20,
        right: 38,
        bottom: 20,
        left: 70
    },

    width = 600 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;


const svg = d3.select("#bubble")
    .append("div")
    .classed("svg-contatiner", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 600, 550`)
    .attr("id", "svg-content-responsive")


const bubbleChart = d3.select("#svg-content-responsive")

const x = d3.scaleLinear()

const y = d3.scaleBand().rangeRound([0, height], 0.1)


d3.json('https://raw.githubusercontent.com/yiranni/color-in-landscapes/gh-pages/src/data/formattedFinal.json', function (error, data) {

    const final = data;
    console.log(data)
    let defaultData = final;

    const defs = svg.append("defs");

    x.domain([d3.min(defaultData, function (d) {
            return d.date
        }), d3.max(defaultData, function (d) {
            return d.date
        })])
        .range([0, width])
        .nice();

    y.domain(d3.map(defaultData, function (d) {
                return d.culture
            }).keys()
            .sort())
        .range([height, 0])


    const nestedCulture = d3.nest()
        .key(function (d) {
            console.log(d.culture)
            return d.culture;
        })
        .entries(defaultData);

    defaultData.forEach(d => d.ideally = y(d.culture) + ((height / nestedCulture.length) / 2))



    // y.domain(d3.map(fullData, function (d) {
    //     return d.pivot;
    // }).keys().sort());



    const xAxis = d3.axisBottom(x)
        .tickSize(0)

    const yAxis = d3.axisLeft(y)
        .tickSize(0)
        .tickPadding(20);

    const simulation = d3.forceSimulation(defaultData)
        .force("x", d3.forceX(function (d) {
            return x(d.date)
        }))
        .force("y", d3.forceY(function (d) {
            return (d.ideally)
        }))
        .force("collide", d3.forceCollide(8).strength(2).iterations(2))
        .stop()

    for (var i = 0; i < 120; i++) {
        simulation.tick()
    }



    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis)
    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .attr("transform", `translate(${margin.left},${margin.top})`)

    defs.selectAll(".painting-pattern")
        .data(defaultData)
        .enter().append("pattern")
        .attr("class", "painting-pattern")
        .attr("id", function (d) {
            return d.objectID
        })
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xmlns:xlinks", "http://www.w3.org/1999/xlink")
        .attr("xlink:href", function (d) {
            return d.objectImage;
        })

    bubbleChart.append("g")
        .selectAll("dot")
        .data(defaultData)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return margin.left
        })
        .attr("cy", function (d) {
            return height / 2 + margin.top
        })
        .attr("r", 8)
        .attr("fill", function (d) {
            return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])
            // return `url(#${d.objectID})`
        })
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("transform", `translate(${margin.left},${margin.top})`)





    d3.selectAll(".domain").remove();

    d3.selectAll("button.btn")
        .on("click", function (d) {
            let selectedOption = d3.select(this).property("value")
            console.log(selectedOption);
            updateChart(selectedOption);
        })




    function updateChart(selected) {
        let newData = final;
        // console.log(newData[0])

        d3.selectAll("text").remove();
        d3.selectAll("circle").remove();

        x.domain([d3.min(newData, function (d) {
                return d.date
            }), d3.max(newData, function (d) {
                return d.date
            })])
            .range([0, width])
            .nice();
        y.domain(d3.map(newData, function (d) {
                return d[selected]
            }).keys()
            .sort())


        const nested = d3.nest()
            .key(function (d) {
                // console.log(d[selected])
                return d[selected];
            })
            .entries(newData);

        newData.forEach(d => d.thisideally = y(d[selected]) + ((height / nested.length) / 2));

        console.log(newData[0])

        const thissimulation = d3.forceSimulation(newData)
            .force("x", d3.forceX(function (d) {
                return x(d.date)
            }))
            .force("y", d3.forceY(function (d) {
                return (d.thisideally)
            }))
            .force("collide", d3.forceCollide(8).strength(1).iterations(2))
            .stop()
        for (var i = 0; i < 120; i++) {
            thissimulation.tick()
        }
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
            .call(xAxis)
        svg.append("g")
            .attr("class", "yAxis")
            .call(yAxis)
            .attr("transform", `translate(${margin.left},${margin.top})`)


        bubbleChart.append("g")
            .selectAll("dot")
            .data(newData)
            .enter()
            .append("circle")
            .attr("cx", function (d, i) {
                return margin.left
            })
            .attr("cy", function (d) {
                return height / 2 + margin.top
            })
            .attr("r", 8)
            .attr("fill", function (d) {
                return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])
            })
            .transition()
            .duration(1000)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("transform", `translate(${margin.left},${margin.top})`)

        d3.selectAll("circle")
            .on("mouseover", function (d) {
                d3.select(this)
                    .style('cursor', 'pointer')
                    .attr("fill", function (d) {
                        return `url(#${d.objectID})`
                    })
                    .attr("r", 30)
                    .raise()
            })

        d3.selectAll("circle")
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("fill", function (d) {
                        return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])

                    })
                    .attr("r", 8)
            })

        d3.selectAll(".domain").remove();
    }


    d3.selectAll("circle")
        .on("mouseover", function (d) {
            d3.select(this)
                .style('cursor', 'pointer')
                .attr("fill", function (d) {
                    return `url(#${d.objectID})`
                })
                .attr("r", 30)
                .raise()
        })

    d3.selectAll("circle")
        .on("mouseout", function (d) {
            d3.select(this)
                .attr("fill", function (d) {
                    return d3.rgb(d.colorValue[0], d.colorValue[1], d.colorValue[2])

                })
                .attr("r", 8)
        })
    bubbleChart.append("text")
        .text("A.D.")
        .attr("transform", `translate(${width + margin.left + 18}, ${height + margin.top + 10})`)
    bubbleChart.append("text")
        .text("Hover dots to explore paintings.")
        .attr("transform", `translate(${width - margin.left}, ${margin.top})`)
        .attr("fill", "darkgray")
})