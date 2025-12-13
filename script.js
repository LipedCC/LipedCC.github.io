const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1449459284709740545/xWFvYHVzlY9_Sq6VV5xqoRCL1nJw2cMneuEHbL33AW5-zdErKChgWl-Ct5KRHBJ_0v5_";

const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  dx: (Math.random() - 0.5) * 0.6,
  dy: (Math.random() - 0.5) * 0.6
}));

(function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,0,0,0.7)";
  particles.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
})();

/* CHECKOUT LOGIC */
let selectedItem = {};

function openCheckout(name, price, info) {
  selectedItem = { name, price };
  document.getElementById("checkoutInfo").innerText = info;
  document.getElementById("checkout").style.display = "flex";
}

function closeCheckout() {
  document.getElementById("checkout").style.display = "none";
}

async function submitOrder() {
  const discord = document.getElementById("discordInput").value;
  const deadline = document.getElementById("deadlineInput").value;
  const platform = document.getElementById("platformInput").value;
  const details = document.getElementById("detailsInput").value;

  if (!discord || !details) return;

  const content = {
    embeds: [{
      title: "🧾 New Order",
      color: 16711680,
      fields: [
        { name: "Service", value: selectedItem.name, inline: true },
        { name: "Price", value: "€" + selectedItem.price, inline: true },
        { name: "Discord", value: discord },
        { name: "Platform", value: platform || "N/A" },
        { name: "Deadline", value: deadline || "Not specified" },
        { name: "Details", value: details }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content)
  });

  document.getElementById("itemName").value = selectedItem.name;
  document.getElementById("itemAmount").value = selectedItem.price;
  document.getElementById("paypalCustom").value = discord;

  document.getElementById("paypalForm").submit();
}
