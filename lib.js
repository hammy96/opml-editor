function deepCopyNode(node) {
            return {
                name: node.name,
                collapsed: node.collapsed,
                children: node.children ? node.children.map(deepCopyNode) : []
            };
        }



function roundedRectPath(x, y, width, height, radius) {
            return `
                M${x+radius},${y}
                H${x+width-radius}
                A${radius},${radius} 0 0 1 ${x+width-radius},${y+height}
                H${x+radius}
                A${radius},${radius} 0 0 1 ${x+radius},${y}
                Z
            `;
        }





function hideContextMenu() {
            contextMenu.style.display = "none";
            selectedNode = null;
            updatePasteButton();
        }

        function updatePasteButton() {
            document.getElementById("pasteNode").disabled = !pasteBuffer;
        }

        function parseOPML(xml) {
            function parseNode(xmlNode) {
                const node = {
                    name: xmlNode.getAttribute("text") || "Untitled",
                    children: [],
                    collapsed: xmlNode.getAttribute("collapsed") === "true"
                };
                const outlines = xmlNode.children;
                for (let i = 0; i < outlines.length; i++) {
                    node.children.push(parseNode(outlines[i]));
                }
                return node;
            }

            const body = xml.querySelector("body");
            const outlines = body.querySelectorAll(":scope > outline");
            if (outlines.length === 0) return { name: "Empty OPML", children: [], collapsed: false };
            if (outlines.length === 1) return parseNode(outlines[0]);
            return {
                name: "Root",
                children: Array.from(outlines).map(parseNode),
                collapsed: false
            };
        }
        
        
        
        
        function renderTree(rootData) {
    g.selectAll("*").remove();

    const root = d3.hierarchy(rootData, d => d.collapsed ? null : d.children);
    const treeLayout = d3.tree().nodeSize([120 * nodeScale, 240 * nodeScale]);
    treeLayout(root);

    
        
    g.selectAll(".link")
        .data(root.links())
        .join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", 3 * nodeScale * strokeWidth) // Adjust stroke width based on slider
        .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));

        
        
    const node = g.selectAll(".node")
        .data(root.descendants())
        .join("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x}) scale(${nodeScale})`)
        .on("click", (event, d) => {
            d.data.collapsed = !d.data.collapsed;
            dbg(`Toggled '${d.data.name}' to ${d.data.collapsed}`);
            renderTree(rootData);
            event.stopPropagation();
        })
        .on("contextmenu", (event) => event.preventDefault())
        .on("mousedown touchstart", function(event, d) {
            const pressTimer = setTimeout(() => {
                selectedNode = d.data;
                updatePasteButton();
                showContextMenu(event);
            }, 600);
            d3.select(this).on("mouseup touchend", () => clearTimeout(pressTimer));
        });

    node.append("path")
        .attr("d", d => {
            const context = document.createElement("canvas").getContext("2d");
            context.font = `${20 * nodeScale}px sans-serif`;
            const textWidth = context.measureText(d.data.name).width + 30 * nodeScale;
            const width = Math.max(80 * nodeScale, textWidth);
            const height = 40 * nodeScale;
            const r = height / 2;
            return roundedRectPath(-width/2, -r, width, height, r);
        })
        .attr("fill", d => d.children && d.children.length > 0 ? "#66b" : "#999")
        .attr("stroke", "#333")
        .attr("stroke-width", 2 * nodeScale);

    node.append("text")
        .attr("dy", "0.35em")
        .style("text-anchor", "middle")
        .style("font", `${20 * nodeScale}px sans-serif`)
        .style("fill", "white")
        .text(d => d.data.name);
}

        
      
        

        function showContextMenu(event) {
            event.preventDefault();
            const e = event.touches ? event.touches[0] : event;
            let left = e.clientX;
            let top = e.clientY;
            // Keep menu inside viewport horizontally
            if (left + contextMenu.offsetWidth > window.innerWidth) {
                left = window.innerWidth - contextMenu.offsetWidth - 10;
            }
            // Keep menu inside viewport vertically
            if (top + contextMenu.offsetHeight > window.innerHeight) {
                top = window.innerHeight - contextMenu.offsetHeight - 10;
            }
            contextMenu.style.left = `${left}px`;
            contextMenu.style.top = `${top}px`;
            contextMenu.style.display = "block";
        }

        function removeNode(parent, target) {
            if (!parent.children) return false;
            const index = parent.children.indexOf(target);
            if (index !== -1) {
                parent.children.splice(index, 1);
                return true;
            }
            for (const child of parent.children) {
                if (removeNode(child, target)) return true;
            }
            return false;
        }

        

        function generateOPML(rootNode) {
            function buildOutline(node) {
                const outline = document.createElement("outline");
                outline.setAttribute("text", node.name);
                outline.setAttribute("collapsed", node.collapsed ? "true" : "false");
                if (node.children) {
                    node.children.forEach(child => outline.appendChild(buildOutline(child)));
                }
                return outline;
            }
            const opml = document.implementation.createDocument("", "", null);
            const opmlElement = opml.createElement("opml");
            opmlElement.setAttribute("version", "2.0");
            const head = opml.createElement("head");
            const title = opml.createElement("title");
            title.textContent = "Mind Map Export";
            head.appendChild(title);
            const body = opml.createElement("body");
            body.appendChild(buildOutline(rootNode));
            opmlElement.appendChild(head);
            opmlElement.appendChild(body);
            opml.appendChild(opmlElement);
            return new XMLSerializer().serializeToString(opml);
        }










