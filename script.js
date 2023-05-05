const ipAddress = document.getElementById("ip");
const map = document.getElementById("map");
const lat = document.getElementById("lat");
const long = document.getElementById("long");
const city = document.getElementById("city");
const region = document.getElementById("region");
const organisation = document.getElementById("organisation");
const hostname = document.getElementById("hostname");
const timezone = document.getElementById("timezone");
const dateandtime = document.getElementById("dateandtime");
const pincode = document.getElementById("pincode");
const message = document.getElementById("message");

const postOfficeList = document.getElementById("post-office-list");
const searchInput = document.getElementById("search-input");
const loading = document.getElementById("loading");

// Get the IP address on page load
window.addEventListener("load", function() {
    loading.style.display = "block";
    setTimeout(function() {
        fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
                ipAddress.innerText = data.ip;
                loading.style.display = "none";
            });
    }, 1000);
});

// Function to display user's location on map in an iframe
function showMap(latitude, longitude) {
    const div = document.createElement("div");
    div.innerHTML = `<iframe id="iframe" src="https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed"
    width="100%" height="500" frameborder="0" style="border:0; "></iframe>`;
    map.appendChild(div);
}

// Function to get client's IP address
function getIP(json) {
    var ip = json.ip;

    fetch(`https://ipinfo.io/${ip}/json?token=a791bcb3f533e0`)
        .then((response) => response.json())
        .then((data) => {
            // Get the latitude and longitude from the JSON response
            console.log(data);
            var loc = data.loc.split(",");
            var latitude = parseFloat(loc[0]);
            var longitude = parseFloat(loc[1]);
            let pin = data.postal;
            console.log(latitude, longitude);

            let time = new Date().toLocaleString("en-US", `${data.timezone}`);
            console.log(time);
            lat.innerHTML = `Lat:  ${latitude}`;
            long.innerHTML = `Long:  ${longitude}`;
            city.innerHTML = `City: ${data.city}`;
            region.innerHTML = `Region:  ${data.country}`;
            organisation.innerHTML = `Organization: ${data.org}`;
            hostname.innerHTML = `Hostname: N/A`;
            timezone.innerHTML = `Time Zone: ${data.timezone}`;
            dateandtime.innerHTML = `Date And Time: ${time}`;
            pincode.innerHTML = `Pincode: ${data.postal}`;

            let postOffices = [];
            // Fetch post offices for given pincode
            function fetchPostOffices() {
                fetch(`https://api.postalpincode.in/pincode/${pin}`)
                    .then((response) => response.json())
                    .then((data) => {
                        postOffices = data[0].PostOffice;
                        message.innerHTML = `Message: ${data[0].Message}`;
                        showPO(postOffices);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            fetchPostOffices();

            // list of post offices
            function showPO(postOffices) {
                postOfficeList.innerHTML = "";

                postOffices.forEach((postOffice) => {
                    const item = document.createElement("div");
                    item.innerHTML = `
                    <div class="card" id="card">
                        <div>
                            <span id="name"><strong>Name:</strong> ${postOffice.Name}</span><br>
                            <span id="branch-type"><strong>Branch Type:</strong> ${postOffice.BranchType} </span>
                            <br>
                            <span><strong>Delivery Status:</strong> ${postOffice.DeliveryStatus}</span>
                            <br>
                            <span><strong>District:</strong> ${postOffice.District}</span>
                            <br>
                            <span><strong>Division:</strong> ${postOffice.Division}</span>
                        </div>
                    </div>
                            `;

                    postOfficeList.appendChild(item);
                });
            }

            const searchInput = document.getElementById("search-input");

            // Filter post offices by name or branch type
            function filterPO() {
                const searchTerm = searchInput.value.toLowerCase().trim();
                const filteredPO = postOffices.filter(
                    (postOffice) =>
                    postOffice.Name.toLowerCase().includes(searchTerm) ||
                    postOffice.BranchType.toLowerCase().includes(searchTerm)
                );

                if (filteredPO.length === 0) {
                    postOfficeList.innerHTML = "<p>No results found</p>";
                } else {
                    showPO(filteredPO);
                }
            }

            // Attach filter function to search input
            searchInput.addEventListener("input", () => {
                filterPO(postOffices);
            });

            // Call fetchPostOffices function to get initial list of post offices
            fetchPostOffices();

            // Display the user's location on a map in an iframe
            showMap(latitude, longitude);
        });
}

const fetchButton = document.getElementById("btn");

function btnclick() {
    // Call the getIP function

    //    Display the loader
    loading.style.display = "block";

    // Hide the loader after 5 seconds
    setTimeout(function() {
        loading.style.display = "none";
        fetchButton.style.display = "none";
        searchInput.style.display = "block";
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://api.ipify.org?format=jsonp&callback=getIP";
        document.head.appendChild(script);
    }, 2000);
}

fetchButton.addEventListener("click", btnclick);