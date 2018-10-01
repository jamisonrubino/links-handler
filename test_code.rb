list = []

all.split(/(\n\r|\n){4,}/).each_with_index do |section, i|
  section.split(/(\n\r|\n)/).each_with_index do |line, j|
    ((list[i] ||= {})['links'] ||= []).push(line.split(/\s+/)[0].strip) if line[0..3] == "http"
    (list[i] ||= {})['section'] = line.strip if (line[0..3] != "http" && line.size > 2)
  end
end