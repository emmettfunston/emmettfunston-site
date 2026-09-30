export type ProjectStatus = "Completed" | "In Development" | "Archived";

export type ProjectCategory =
  | "ASIC / VLSI"
  | "FPGA"
  | "Embedded / PCB"
  | "Industry"
  | "Creative";

export type PortfolioProject = {
  slug: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  summary: string;
  headline: string;
  technologies: string[];
  featured: boolean;
  order: number;
  overview: string[];
  problem: string;
  contributions: string[];
  implementation: string[];
  decisions: string[];
  results: string[];
  learnings: string;
  diagram: string[];
  mediaPrompt: string;
  githubUrl?: string;
};

export const projects: PortfolioProject[] = [
  {
    slug: "mac-systolic-array",
    title: "3×3 Signed MAC Systolic Array",
    shortTitle: "3×3 MAC Array",
    category: "ASIC / VLSI",
    status: "Completed",
    year: "2026",
    summary:
      "A signed Verilog accelerator implemented from RTL through routed physical design in Cadence Innovus.",
    headline:
      "RTL, verification, synthesis, and physical implementation of a 3×3 multiply-accumulate array.",
    technologies: ["Verilog", "Cadence Innovus", "Genus", "Xcelium", "ASIC Flow"],
    featured: true,
    order: 1,
    overview: [
      "Designed a 3×3 systolic multiply-accumulate array for signed 8-bit inputs and weights with approximately 20-bit accumulated outputs.",
      "The project connected front-end digital design with back-end implementation, carrying the same architecture through simulation, synthesis, floorplanning, placement, clock-tree synthesis, routing, and signoff checks.",
    ],
    problem:
      "Build a small, timing-aware compute fabric that demonstrates spatial data reuse and regular processing-element communication, then prove that the RTL can survive a complete physical-design flow.",
    contributions: [
      "Defined the processing-element behavior and array-level data movement.",
      "Implemented staged input and weight pipelines in Verilog.",
      "Developed functional testbenches and verified signed arithmetic behavior.",
      "Owned floorplanning, pin placement, power planning, placement, CTS, routing, and physical verification.",
    ],
    implementation: [
      "Signed 8-bit input and weight paths",
      "Approximately 20-bit signed accumulation",
      "Regular nearest-neighbor systolic data flow",
      "0.5 GHz target clock",
      "Cadence digital implementation flow",
    ],
    decisions: [
      "Used a regular processing-element topology to make data movement explicit and physical layout predictable.",
      "Staged operands before they entered the array so wavefront timing matched the intended multiply-accumulate schedule.",
      "Treated physical implementation as part of the design process rather than a separate visualization step.",
    ],
    results: [
      "Completed routed physical implementation.",
      "Reached 0 errors, 0 warnings, and 0 DRC violations in the final implementation checks.",
      "Verified the complete path from behavioral RTL to placed-and-routed geometry.",
    ],
    learnings:
      "The project made the relationship between architecture, pipeline timing, floorplan quality, clock distribution, and routability concrete. A clean RTL abstraction is only the first step toward a realizable digital system.",
    diagram: ["Signed Inputs", "PE Array", "Accumulation", "Signed Outputs"],
    mediaPrompt: "Add Innovus floorplan, routed layout, timing report, and waveform captures.",
  },
  {
    slug: "sram-memory-bank",
    title: "SRAM Memory Bank",
    shortTitle: "SRAM Bank",
    category: "ASIC / VLSI",
    status: "Completed",
    year: "2026",
    summary:
      "A 45 nm 4×4 6T SRAM bank with differential bitlines and transistor-level peripheral circuitry.",
    headline:
      "Transistor-level memory design, layout, and extracted simulation in Cadence Virtuoso.",
    technologies: ["Cadence Virtuoso", "Spectre", "SRAM", "CMOS", "DRC / LVS"],
    featured: true,
    order: 2,
    overview: [
      "Designed a 4×4 SRAM bank around 6T bitcells, differential bitlines, precharge, write circuitry, and sense amplification.",
      "Verified sequential read and write behavior through schematic and extracted simulation, then completed hierarchical DRC and LVS.",
    ],
    problem:
      "Create a compact memory structure whose bitcells and peripherals operate together reliably across read, write, and precharge phases at the transistor level.",
    contributions: [
      "Designed and simulated the 6T storage-cell behavior.",
      "Integrated row selection, precharge, write drivers, differential bitlines, and sensing.",
      "Built hierarchical schematics and layout blocks.",
      "Ran schematic and extracted simulations plus DRC/LVS verification.",
    ],
    implementation: [
      "45 nm CMOS process",
      "4×4 array of 6T SRAM cells",
      "Differential read path",
      "Precharge and write circuitry",
      "Sense-amplifier-based output",
    ],
    decisions: [
      "Used differential bitlines to improve read robustness and align with conventional SRAM sensing.",
      "Kept the design hierarchical so the bitcell, peripherals, and bank could be verified independently before integration.",
      "Used extracted simulation to account for layout parasitics rather than relying only on schematic behavior.",
    ],
    results: [
      "Verified sequential read/write operation.",
      "Completed hierarchical DRC and LVS.",
      "Characterized operating frequency, energy, and layout area.",
    ],
    learnings:
      "SRAM exposed the tradeoffs between cell stability, write ability, sensing, layout regularity, and peripheral timing. Small circuit choices propagate quickly at array scale.",
    diagram: ["Precharge", "4×4 6T Array", "Sense Amplifier", "Data Out"],
    mediaPrompt: "Add SRAM schematic, layout hierarchy, read/write waveforms, and extracted results.",
  },
  {
    slug: "smart-pdu",
    title: "24 V Smart Power Distribution Unit",
    shortTitle: "24 V Smart PDU",
    category: "Embedded / PCB",
    status: "In Development",
    year: "2026",
    summary:
      "A four-channel, Ethernet-connected 24 V DC power controller with protection and per-channel telemetry.",
    headline:
      "Managed power hardware combining a four-layer PCB, STM32 firmware, Ethernet, protection, and telemetry.",
    technologies: ["KiCad", "STM32F446", "Ethernet", "MQTT", "INA226", "TPS26601"],
    featured: true,
    order: 3,
    overview: [
      "Designing a 24 V managed DC PDU with four independently controlled channels rated around 2 A each and approximately 192 W total system capability.",
      "The board combines protected power switching, current and voltage measurement, remote control, and Ethernet telemetry in one embedded platform.",
    ],
    problem:
      "Provide observable, remotely managed DC power distribution for lab and embedded systems without losing per-channel protection or local fault handling.",
    contributions: [
      "Defined the system architecture and channel-level power path.",
      "Selected the MCU, Ethernet controller, eFuses, monitors, and power regulation.",
      "Developed the hierarchical schematic and four-layer PCB architecture.",
      "Planned embedded firmware and the MQTT-to-Grafana telemetry path.",
    ],
    implementation: [
      "24 V input, four approximately 2 A outputs",
      "STM32F446 control",
      "W5500 Ethernet over SPI",
      "TPS26601 eFuse protection",
      "INA226 voltage/current telemetry over I2C",
      "Mosquitto MQTT → InfluxDB → Grafana",
    ],
    decisions: [
      "Separated protection from measurement so faults can be handled electrically while the MCU reports system state.",
      "Selected Ethernet for predictable wired connectivity in lab and infrastructure environments.",
      "Used hierarchical channel design to keep four repeated power paths consistent and reviewable.",
    ],
    results: [
      "Architecture and component selection complete.",
      "Schematic and PCB development are active.",
      "Bench validation and final telemetry results are not yet claimed.",
    ],
    learnings:
      "The project is forcing system-level tradeoffs across current capacity, thermal behavior, measurement accuracy, protection, layout, firmware, and observability.",
    diagram: ["24 V Input", "Protection", "4× Smart Channels", "STM32 + Ethernet", "MQTT / Grafana"],
    mediaPrompt: "Add block diagram, schematic snippets, PCB renders, firmware architecture, and bench photos.",
  },
  {
    slug: "fpga-matrix-accelerator",
    title: "FPGA Matrix Multiplication Accelerator",
    shortTitle: "FPGA Matrix Accelerator",
    category: "FPGA",
    status: "In Development",
    year: "2026",
    summary:
      "A Verilog matrix-multiplication accelerator targeting the Digilent Arty A7-100T.",
    headline:
      "Exploring pipelining, data movement, BRAM, DSP utilization, and measurable FPGA acceleration.",
    technologies: ["Verilog", "Vivado", "Artix-7", "BRAM", "DSP Slices"],
    featured: true,
    order: 4,
    overview: [
      "Developing a matrix-multiplication accelerator for the Xilinx Artix-7 FPGA on a Digilent Arty A7-100T.",
      "The project extends the MAC-array work into a programmable device where memory architecture, resource use, timing, and host-to-accelerator data movement can be measured on hardware.",
    ],
    problem:
      "Translate regular multiply-accumulate parallelism into an FPGA architecture that balances throughput against BRAM bandwidth, DSP count, routing, and timing closure.",
    contributions: [
      "Defining the baseline software and hardware comparison.",
      "Designing processing elements, control, and pipelined data paths.",
      "Planning BRAM storage and systolic data movement.",
      "Preparing synthesis, timing, utilization, and board-level benchmarking.",
    ],
    implementation: [
      "Digilent Arty A7-100T",
      "Xilinx Artix-7 FPGA",
      "Verilog RTL",
      "Vivado synthesis and implementation",
      "BRAM and DSP-oriented architecture",
    ],
    decisions: [
      "Starting from a correct baseline before increasing parallelism.",
      "Treating memory access and data reuse as first-class architecture constraints.",
      "Planning software-versus-FPGA comparison around throughput, latency, and resource utilization.",
    ],
    results: [
      "Architecture and staged implementation plan defined.",
      "RTL and hardware deployment remain in development.",
      "No final speedup or timing result is claimed yet.",
    ],
    learnings:
      "The active work connects ASIC-style systolic thinking with FPGA-specific constraints such as BRAM organization, DSP mapping, and timing closure.",
    diagram: ["Host Data", "BRAM", "Pipelined PE Array", "Result Buffer", "Benchmark"],
    mediaPrompt: "Add RTL diagrams, Vivado utilization, timing reports, and Arty board photos.",
  },
  {
    slug: "formula-sae-electronics",
    title: "Formula SAE Embedded Electronics",
    shortTitle: "Formula SAE",
    category: "Embedded / PCB",
    status: "Completed",
    year: "2025–2026",
    summary:
      "An STM32 CAN data-acquisition board for mixed-signal sensing and vehicle electronics.",
    headline:
      "Automotive embedded hardware spanning PCB design, firmware, CAN, sensing, and board bring-up.",
    technologies: ["Altium", "STM32", "CAN", "C++", "Mixed Signal"],
    featured: true,
    order: 5,
    overview: [
      "Designed a four-layer STM32 CAN data-acquisition PCB for Formula SAE vehicle electronics.",
      "The board combined multi-rail power conversion, mixed-signal sensing and protection, vehicle-network communication, and wheel-sensor interfaces.",
    ],
    problem:
      "Collect reliable corner and wheel data in a noisy vehicle environment while meeting packaging, power, networking, and serviceability constraints.",
    contributions: [
      "Contributed schematic capture and PCB layout.",
      "Integrated STM32 control, CAN communication, sensor inputs, and power rails.",
      "Brought up and validated power and CAN interfaces.",
      "Developed wheel-sensor firmware for ADC processing, module identification, and connectivity diagnostics.",
    ],
    implementation: [
      "Four-layer PCB",
      "STM32 microcontroller",
      "CAN vehicle network",
      "Mixed-signal sensor interfaces",
      "Multi-rail power conversion",
    ],
    decisions: [
      "Reduced board footprint while retaining connectors, protection, and debug access.",
      "Used module identification and diagnostics in firmware to make vehicle-side faults easier to isolate.",
      "Validated power and communication interfaces before layering on sensor behavior.",
    ],
    results: [
      "Reduced a design iteration's board footprint by approximately 30%.",
      "Completed board bring-up for power and CAN interfaces.",
      "Implemented wheel-sensor and connectivity-diagnostic firmware.",
    ],
    learnings:
      "Vehicle electronics made reliability, grounding, connector strategy, and diagnosability as important as nominal schematic function.",
    diagram: ["Wheel Sensors", "Analog Front End", "STM32", "CAN Bus", "Vehicle Logger"],
    mediaPrompt: "Add board renders, assembled PCB photos, wiring, and bring-up captures.",
  },
  {
    slug: "bambeck-systems",
    title: "Bambeck Systems — Industrial Gas Analyzers",
    shortTitle: "Bambeck Systems",
    category: "Industry",
    status: "Completed",
    year: "2024",
    summary:
      "Field engineering on industrial quantum-cascade-laser gas analyzers and supporting software.",
    headline:
      "Electrical troubleshooting, calibration, optics, instrumentation, C++, and Python on deployed industrial equipment.",
    technologies: ["Instrumentation", "C++", "Python", "Sensors", "Field Work"],
    featured: false,
    order: 6,
    overview: [
      "Worked on industrial optical gas-analysis systems used in refinery and heavy-industry environments.",
      "Combined field installation, analyzer repair, wiring, optical alignment, heating systems, calibration, and data software.",
    ],
    problem:
      "Restore and validate accurate gas measurements in real facilities where electrical, optical, thermal, and software issues can interact.",
    contributions: [
      "Troubleshot analyzer wiring and sensor systems.",
      "Supported optical alignment, repair, installation, and calibration.",
      "Worked on C++ transmitter/control software.",
      "Built Python data-logging utilities.",
    ],
    implementation: [
      "Quantum cascade laser analyzers",
      "Industrial electrical systems",
      "Optical and thermal subsystems",
      "C++ control software",
      "Python data logging",
    ],
    decisions: [
      "Used measured system behavior to isolate faults across electrical, optical, and software boundaries.",
      "Validated calibration after repair instead of treating component replacement as completion.",
    ],
    results: [
      "Improved a CO analyzer reading from approximately 200 ppm to 10 ppm through troubleshooting and calibration.",
      "Completed field work at customer industrial facilities.",
    ],
    learnings:
      "Real equipment rarely fails along clean disciplinary boundaries. Effective field engineering requires a complete-system view and disciplined measurement.",
    diagram: ["Laser Source", "Gas Cell", "Detector", "Control Electronics", "Calibration / Logging"],
    mediaPrompt: "Add approved analyzer, field-installation, or instrumentation photos if available.",
  },
  {
    slug: "schneider-asco",
    title: "Schneider Electric / ASCO Power Technologies",
    shortTitle: "Schneider / ASCO",
    category: "Industry",
    status: "Completed",
    year: "2026",
    summary:
      "Engineering support for automatic transfer switches, power-control systems, and technical workflows.",
    headline:
      "Electrical one-lines, system specifications, application requirements, and engineering workflow automation.",
    technologies: ["Power Systems", "One-Line Diagrams", "ASCO", "Power Automate"],
    featured: false,
    order: 7,
    overview: [
      "Supported engineering workflows around ASCO automatic transfer switches and power-control systems.",
      "Worked from one-line diagrams, specifications, and customer requirements to evaluate technical product configurations.",
    ],
    problem:
      "Translate electrical-system requirements into valid equipment configurations while keeping complex technical and project information organized.",
    contributions: [
      "Analyzed electrical one-lines and technical specifications.",
      "Evaluated ratings, controllers, transition modes, protection, and accessories.",
      "Supported Field Sales Engineers and Inside Sales Engineers with technical application work.",
      "Explored workflow automation with Microsoft Copilot and Power Automate.",
    ],
    implementation: [
      "Automatic transfer switch applications",
      "Power-control system requirements",
      "Engineering documentation",
      "Request classification and project tracking concepts",
    ],
    decisions: [
      "Kept the work centered on technical fit and electrical constraints rather than treating it as a sales exercise.",
      "Applied automation to repetitive information flow while preserving engineer review for application decisions.",
    ],
    results: [
      "Built practical familiarity with power-system application engineering.",
      "Developed automation concepts for organizing project and technical information.",
    ],
    learnings:
      "Application engineering showed how technical correctness, documentation quality, and clear communication interact in customer-facing power-system work.",
    diagram: ["One-Line Diagram", "Requirements", "Equipment Configuration", "Engineering Review"],
    mediaPrompt: "Add non-confidential one-line or product-application visuals if approved.",
  },
  {
    slug: "ai-piano",
    title: "AI Piano",
    shortTitle: "AI Piano",
    category: "Creative",
    status: "Completed",
    year: "2024",
    summary:
      "An Arduino music system combining shift-register-driven LEDs, sound, serial communication, and Python.",
    headline:
      "A compact hardware/software integration project connecting music, embedded control, and generated chord data.",
    technologies: ["Arduino", "C++", "Python", "Serial", "74HC595"],
    featured: false,
    order: 8,
    overview: [
      "Built an interactive Arduino-based piano and music system with approximately 24 LEDs, a piezo buzzer, and three 74HC595 shift registers.",
      "Python communicated with the Arduino over serial and generated musical or chord information for the embedded interface.",
    ],
    problem:
      "Coordinate more visual outputs than the microcontroller could drive directly while maintaining timing for sound and serial commands.",
    contributions: [
      "Designed the LED and shift-register hardware.",
      "Implemented Arduino control logic in C++.",
      "Built the Python serial interface.",
      "Connected generated musical information to physical light and sound output.",
    ],
    implementation: [
      "Arduino microcontroller",
      "Three 74HC595 shift registers",
      "Approximately 24 LEDs",
      "Piezo buzzer",
      "Python-to-Arduino serial protocol",
    ],
    decisions: [
      "Used cascaded shift registers to expand outputs without consuming one GPIO per LED.",
      "Separated higher-level content generation in Python from deterministic device control on the Arduino.",
    ],
    results: [
      "Completed an interactive end-to-end hardware/software prototype.",
      "Demonstrated serial control, output expansion, and synchronized visual/audio behavior.",
    ],
    learnings:
      "The project was an early exercise in partitioning a system between host software and embedded control while keeping the interaction tangible.",
    diagram: ["Python", "Serial", "Arduino", "Shift Registers", "LEDs + Audio"],
    mediaPrompt: "Add wiring, enclosure, and demonstration video if available.",
  },
  {
    slug: "rp2350-experiments",
    title: "RP2350 Embedded Experiments",
    shortTitle: "RP2350 Experiments",
    category: "Embedded / PCB",
    status: "Archived",
    year: "2025",
    summary:
      "A set of Raspberry Pi Pico 2 experiments in sensor interfaces, peripherals, and hardware prototyping.",
    headline:
      "Embedded experiments across GPIO, I2C, SPI, UART, and sensor integration.",
    technologies: ["RP2350", "C / C++", "I2C", "SPI", "UART"],
    featured: false,
    order: 9,
    overview: [
      "Used Raspberry Pi Pico and Pico 2-class microcontrollers for embedded programming, sensor interfaces, and hardware prototyping.",
      "This entry represents a collection of experiments rather than one finished product.",
    ],
    problem:
      "Build familiarity with microcontroller peripherals and practical sensor integration on a fast prototyping platform.",
    contributions: [
      "Configured GPIO and serial peripherals.",
      "Integrated sensors over common embedded interfaces.",
      "Developed small C/C++ firmware experiments.",
    ],
    implementation: ["RP2350", "GPIO", "I2C", "SPI", "UART", "C / C++"],
    decisions: [
      "Used small experiments to isolate peripheral behavior before integrating similar interfaces into larger systems.",
    ],
    results: [
      "Completed multiple working peripheral and sensor prototypes.",
      "Archived as supporting embedded experience rather than presented as a major completed product.",
    ],
    learnings:
      "Focused prototypes are useful for reducing interface risk before committing them to a larger PCB or firmware architecture.",
    diagram: ["Sensors", "I2C / SPI / UART", "RP2350", "Firmware"],
    mediaPrompt: "Add representative breadboard and sensor photos if this collection is expanded.",
  },
];

export const featuredProjects = projects
  .filter((project) => project.featured)
  .sort((a, b) => a.order - b.order);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectStatusClass(status: ProjectStatus) {
  switch (status) {
    case "Completed":
      return "border-emerald-700/20 bg-emerald-700/8 text-emerald-800";
    case "In Development":
      return "border-brand/25 bg-brand/8 text-brand";
    case "Archived":
      return "border-foreground/15 bg-muted text-muted-foreground";
  }
}
