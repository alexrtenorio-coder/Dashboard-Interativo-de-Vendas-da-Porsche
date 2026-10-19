
const PAGE_SIZE = 10;
const $ = (id) => document.getElementById(id);

const models = [
  { name: "911 Carrera", min: 145000, max: 205000 },
  { name: "Cayenne", min: 92000, max: 145000 },
  { name: "Macan", min: 62000, max: 88000 },
  { name: "Panamera", min: 105000, max: 165000 },
  { name: "Taycan", min: 88000, max: 155000 },
  { name: "718 Cayman", min: 78000, max: 112000 }
];

const regions = [
  "América do Norte",
  "Europa",
  "Ásia-Pacífico",
  "América Latina",
  "Oriente Médio"
];

const channels = [
  "Concessionária",
  "Online",
  "Venda corporativa"
];

let sales = [];
let currentPage = 1;
const charts = {};

function seededRandom(seed) {
  let value = seed >>> 0;
  return function () {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function generateSales() {
  const random = seededRandom(2025);
  const result = [];

  for (let i = 1; i <= 100; i++) {
    const model = models[Math.floor(random() * models.length)];
    const listPrice = model.min + random() * (model.max - model.min);
    const discount = Math.round(random() * 700) / 100;
    const netPrice = listPrice * (1 - discount / 100);
    const dayOfYear = Math.floor(random() * 365);
    const soldDate = new Date(Date.UTC(2025, 0, 1 + dayOfYear));

    result.push({
      id: `V${String(i).padStart(3, "0")}`,
      date: soldDate.toISOString().slice(0, 10),
      year: "2025",
      model: model.name,
      region: regions[Math.floor(random() * regions.length)],
      channel: channels[Math.floor(random() * channels.length)],
      discount,
      listPrice: Math.round(listPrice * 100) / 100,
      netPrice: Math.round(netPrice * 100) / 100,
      units: 1
    });
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

function currency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function percentage(value) {
  return `${value.toLocaleString("pt-BR", {
    maximumFractionDigits: 2
  })}%`;
}

function fillFilter(id, values) {
  const select = $(id);
  const uniqueValues = [...new Set(values)]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  uniqueValues.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function getFilteredSales() {
  const model = $("modelFilter").value;
  const region = $("regionFilter").value;
  const channel = $("channelFilter").value;
  const year = $("yearFilter").value;
  const query = $("searchInput").value.trim().toLocaleLowerCase("pt-BR");

  return sales.filter(sale => {
    const matchesFilters =
      (!model || sale.model === model) &&
      (!region || sale.region === region) &&
      (!channel || sale.channel === channel) &&
      (!year || sale.year === year);

    const searchableText = [
      sale.id,
      sale.model,
      sale.region,
      sale.channel
    ].join(" ").toLocaleLowerCase("pt-BR");

    return matchesFilters && (!query || searchableText.includes(query));
  });
}

function sumBy(data, key, valueKey) {
  return data.reduce((result, item) => {
    result[item[key]] = (result[item[key]] || 0) + item[valueKey];
    return result;
  }, {});
}

function makeChart(id, type, labels, datasets, options = {}) {
  if (charts[id]) {
    charts[id].destroy();
  }

  charts[id] = new Chart($(id), {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type === "doughnut",
          position: "bottom"
        }
      },
      ...options
    }
  });
}

function renderKPIs(data) {
  const revenue = data.reduce((sum, sale) => sum + sale.netPrice, 0);
  const units = data.reduce((sum, sale) => sum + sale.units, 0);
  const avgDiscount = data.length
    ? data.reduce((sum, sale) => sum + sale.discount, 0) / data.length
    : 0;

  $("revenueKpi").textContent = currency(revenue);
  $("unitsKpi").textContent = units.toLocaleString("pt-BR");
  $("ticketKpi").textContent = currency(units ? revenue / units : 0);
  $("discountKpi").textContent = percentage(avgDiscount);
}

function renderCharts(data) {
  const monthlyTotals = {};

  data.forEach(sale => {
    const month = sale.date.slice(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + sale.netPrice;
  });

  const monthNames = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const monthKeys = Object.keys(monthlyTotals).sort();

  makeChart(
    "monthlyChart",
    "line",
    monthKeys.map(key => {
      const monthNumber = Number(key.slice(5, 7)) - 1;
      return `${monthNames[monthNumber]}/${key.slice(2, 4)}`;
    }),
    [{
      label: "Faturamento",
      data: monthKeys.map(key => monthlyTotals[key]),
      borderColor: "#c8102e",
      backgroundColor: "rgba(200,16,46,0.10)",
      fill: true,
      tension: 0.3
    }],
    {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: value => `$${(value / 1000).toFixed(0)}k` }
        }
      }
    }
  );

  const modelTotals = sumBy(data, "model", "netPrice");
  const modelEntries = Object.entries(modelTotals)
    .sort((a, b) => b[1] - a[1]);

  makeChart(
    "modelChart",
    "bar",
    modelEntries.map(entry => entry[0]),
    [{
      label: "Faturamento",
      data: modelEntries.map(entry => entry[1]),
      backgroundColor: "#c8102e",
      borderRadius: 5
    }],
    {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: value => `$${(value / 1000).toFixed(0)}k` }
        }
      }
    }
  );

  const regionTotals = sumBy(data, "region", "units");
  const regionEntries = Object.entries(regionTotals)
    .sort((a, b) => b[1] - a[1]);

  makeChart(
    "regionChart",
    "doughnut",
    regionEntries.map(entry => entry[0]),
    [{
      label: "Unidades",
      data: regionEntries.map(entry => entry[1]),
      backgroundColor: [
        "#c8102e", "#333842", "#858b95", "#c4c8ce", "#e4e6e9"
      ],
      borderWidth: 0
    }],
    { cutout: "65%" }
  );
}

function renderTable(data) {
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleSales = data.slice(start, start + PAGE_SIZE);

  const table = $("salesTable");

  if (visibleSales.length === 0) {
    table.innerHTML =
      '<tr><td colspan="7" class="empty">Nenhuma venda encontrada.</td></tr>';
  } else {
    table.replaceChildren();

    visibleSales.forEach(sale => {
      const row = document.createElement("tr");
      const values = [
        new Date(`${sale.date}T12:00:00Z`).toLocaleDateString("pt-BR", {
          timeZone: "UTC"
        }),
        sale.id,
        sale.model,
        sale.region,
        sale.channel,
        percentage(sale.discount),
        currency(sale.netPrice)
      ];

      values.forEach((value, index) => {
        const cell = document.createElement("td");
        cell.textContent = value;

        if (index === 2) {
          const tag = document.createElement("span");
          tag.className = "model-tag";
          tag.textContent = value;
          cell.replaceChildren(tag);
        }

        if (index === 6) cell.className = "money";
        row.appendChild(cell);
      });

      table.appendChild(row);
    });
  }

  $("tableCount").textContent = `${data.length} de ${sales.length} vendas`;
  $("pageInfo").textContent = `Página ${currentPage} de ${totalPages}`;
  $("prevPage").disabled = currentPage <= 1;
  $("nextPage").disabled = currentPage >= totalPages;
}

function render() {
  const data = getFilteredSales();
  renderKPIs(data);
  renderCharts(data);
  renderTable(data);
}

function resetFilters() {
  ["modelFilter", "regionFilter", "channelFilter", "yearFilter"]
    .forEach(id => { $(id).value = ""; });

  $("searchInput").value = "";
  currentPage = 1;
  render();
}

function downloadCSV() {
  const data = getFilteredSales();
  const headers = [
    "id_venda", "data", "modelo", "regiao", "canal",
    "desconto_pct", "preco_lista_usd", "valor_venda_usd", "unidades"
  ];

  const rows = data.map(sale => [
    sale.id,
    sale.date,
    sale.model,
    sale.region,
    sale.channel,
    sale.discount,
    sale.listPrice,
    sale.netPrice,
    sale.units
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vendas_porsche_demo.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function init() {
  sales = generateSales();

  fillFilter("modelFilter", sales.map(sale => sale.model));
  fillFilter("regionFilter", sales.map(sale => sale.region));
  fillFilter("channelFilter", sales.map(sale => sale.channel));
  fillFilter("yearFilter", sales.map(sale => sale.year));

  ["modelFilter", "regionFilter", "channelFilter", "yearFilter"]
    .forEach(id => $(id).addEventListener("change", () => {
      currentPage = 1;
      render();
    }));

  $("searchInput").addEventListener("input", () => {
    currentPage = 1;
    render();
  });

  $("resetFilters").addEventListener("click", resetFilters);
  $("prevPage").addEventListener("click", () => {
    currentPage--;
    render();
  });

  $("nextPage").addEventListener("click", () => {
    currentPage++;
    render();
  });

  $("downloadCSV").addEventListener("click", downloadCSV);

  render();
}

document.addEventListener("DOMContentLoaded", init);
