/**
 * AJAX Implementation for LifeFlowHub Features
 * This script handles asynchronous data loading for the features page
 */

// Function to load headquarters location data
function loadHeadquartersLocation() {
  // Step 1: Create XMLHttpRequest object (Gathering Information)
  const xhr = new XMLHttpRequest()

  // Step 4: Set up callback method
  xhr.onreadystatechange = function () {
    // Check if the request is complete and successful
    if (this.readyState === 4) {
      if (this.status === 200) {
        // Parse and display the location data
        const locationData = JSON.parse(this.responseText)
        displayLocationData(locationData)
      } else {
        // Handle errors
        document.getElementById("location-display").textContent =
          "Unable to load location data. Please try again later."
      }
    }
  }

  // Step 2 & 3: Initialize request and open connection
  xhr.open("GET", "api/headquarters-location.json", true)

  // Step 5: Send the request
  xhr.send()
}

// Function to display location data
function displayLocationData(data) {
  const locationDisplay = document.getElementById("location-display")
  locationDisplay.innerHTML = `
        <strong>LifeFlowHub Headquarters:</strong><br>
        Address: ${data.address}<br>
        Coordinates: ${data.latitude}, ${data.longitude}<br>
        Phone: ${data.phone}
    `
}

// Function to load feature details
function loadFeatureDetails(featureId) {
  // Step 1: Create XMLHttpRequest object
  const xhr = new XMLHttpRequest()

  // Step 4: Set up callback method
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        // Parse and display the feature data
        const featureData = JSON.parse(this.responseText)
        displayFeatureDetails(featureId, featureData)
      } else {
        // Handle errors
        document.getElementById(`feature-${featureId}-details`).innerHTML =
          "<p>Unable to load feature details. Please try again later.</p>"
      }
    }
  }

  // Step 2 & 3: Initialize request and open connection
  xhr.open("GET", `api/features/${featureId}.json`, true)

  // Step 5: Send the request
  xhr.send()
}

// Function to display feature details
function displayFeatureDetails(featureId, data) {
  const detailsContainer = document.getElementById(`feature-${featureId}-details`)

  let listItems = ""
  data.benefits.forEach((benefit) => {
    listItems += `<li>${benefit}</li>`
  })

  detailsContainer.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <ul>${listItems}</ul>
    `
}

// Function to load habit chart data
function loadHabitChartData() {
  // Step 1: Create XMLHttpRequest object
  const xhr = new XMLHttpRequest()

  // Step 4: Set up callback method
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        // Parse the habit data and update the chart
        const habitData = JSON.parse(this.responseText)
        updateHabitChart(habitData)
      } else {
        // Handle errors
        console.error("Failed to load habit chart data")
      }
    }
  }

  // Step 2 & 3: Initialize request and open connection
  xhr.open("GET", "api/habit-chart-data.json", true)

  // Step 5: Send the request
  xhr.send()
}

// Function to update the habit chart with new data
function updateHabitChart(chartData) {
  const ctx = document.getElementById("habit-chart").getContext("2d")

  // Clear previous chart
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Set up chart dimensions
  const chartHeight = ctx.canvas.height - 40
  const barWidth = (ctx.canvas.width - 40) / chartData.data.length
  const maxValue = Math.max(...chartData.data)

  // Draw bars with the new data
  chartData.data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight
    ctx.fillStyle = chartData.colors[index]
    ctx.fillRect(40 + index * barWidth, chartHeight - barHeight, barWidth - 5, barHeight)
  })

  // Draw x-axis labels
  ctx.fillStyle = "#333"
  ctx.font = "12px Arial"
  ctx.textAlign = "center"
  chartData.labels.forEach((label, index) => {
    ctx.fillText(label, 40 + index * barWidth + barWidth / 2, ctx.canvas.height - 10)
  })

  // Draw y-axis labels
  ctx.textAlign = "right"
  ctx.textBaseline = "middle"
  for (let i = 0; i <= 100; i += 25) {
    const y = chartHeight - (i / 100) * chartHeight
    ctx.fillText(i + "%", 35, y)
  }

  // Update chart title
  document.getElementById("habit-chart-title").textContent = chartData.title
}

// Function to load all features data
function loadAllFeatures() {
  // Step 1: Create XMLHttpRequest object
  const xhr = new XMLHttpRequest()

  // Step 4: Set up callback method
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        // Parse and display all features
        const featuresData = JSON.parse(this.responseText)
        displayAllFeatures(featuresData)
      } else {
        // Handle errors
        document.querySelector(".feature-grid").innerHTML = "<p>Unable to load features. Please try again later.</p>"
      }
    }
  }

  // Step 2 & 3: Initialize request and open connection
  xhr.open("GET", "api/all-features.json", true)

  // Step 5: Send the request
  xhr.send()
}

// Function to display all features
function displayAllFeatures(featuresData) {
  const featureGrid = document.querySelector(".feature-grid")
  featureGrid.innerHTML = ""

  featuresData.forEach((feature) => {
    const featureItem = document.createElement("div")
    featureItem.className = "feature-item"
    featureItem.innerHTML = `
            <h3>${feature.title}</h3>
            <p>${feature.shortDescription}</p>
            <button class="btn feature-details-btn" data-feature-id="${feature.id}">
                Learn More
            </button>
        `
    featureGrid.appendChild(featureItem)
  })

  // Add event listeners to the new buttons
  document.querySelectorAll(".feature-details-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const featureId = this.getAttribute("data-feature-id")
      loadFeatureDetails(featureId)
    })
  })
}

// Initialize when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listener for the location button
  const locationButton = document.getElementById("get-location")
  if (locationButton) {
    locationButton.addEventListener("click", loadHeadquartersLocation)
  }

  // Load habit chart data when the page loads
  loadHabitChartData()

  // Add a button to load all features
  const featuresSection = document.getElementById("features")
  if (featuresSection) {
    const loadButton = document.createElement("button")
    loadButton.className = "btn"
    loadButton.textContent = "Load All Features"
    loadButton.id = "load-features-btn"
    featuresSection.querySelector(".container h2").after(loadButton)

    // Add event listener to the new button
    document.getElementById("load-features-btn").addEventListener("click", loadAllFeatures)
  }
})

