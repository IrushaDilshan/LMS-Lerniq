import sys

def convert_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    properties = []
    
    for line in lines:
        if 'private ' in line and ';' in line and '(' not in line:
            parts = line.strip().split(' ')
            if len(parts) >= 3:
                ptype = parts[-2]
                name = parts[-1].replace(';', '')
                properties.append((ptype, name))
                
    getters_setters = ""
    for ptype, name in properties:
        capitalized = name[0].upper() + name[1:]
        getters_setters += f"""
    public {ptype} get{capitalized}() {{
        return this.{name};
    }}
    
    public void set{capitalized}({ptype} {name}) {{
        this.{name} = {name};
    }}
"""
    
    out_lines = []
    for line in lines:
        if '@Getter' in line or '@Setter' in line or 'import lombok' in line:
            continue
        if line.strip() == '}':
            if len(out_lines) > 0 and out_lines[-1].strip() != '}':
                # this is the end of the class
                out_lines.append(getters_setters)
        out_lines.append(line)
        
    with open(filepath, 'w') as f:
        f.write('\n'.join(out_lines))

for f in ["src/main/java/com/smartcampus/ticketing_service/model/IncidentTicket.java", 
          "src/main/java/com/smartcampus/ticketing_service/dto/TicketCreateRequest.java",
          "src/main/java/com/smartcampus/ticketing_service/dto/TicketResponse.java"]:
   convert_file(f)
