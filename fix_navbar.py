import os
import re

dir_path = r"e:\Agecosco"
count = 0

def process_file(path, filename):
    with open(path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Try to find the navbar-nav block
    navbar_match = re.search(r'<div class="navbar-nav ms-auto py-4 py-lg-0">(.*?)</div>\s*<div class="h-100 d-lg-inline-flex', content, flags=re.DOTALL)
    if navbar_match:
        nav_content = navbar_match.group(1)
        original_nav = nav_content
        
        # Top-level links
        nav_content = re.sub(r'<a href="index\.html" data-i18n="nav\.home">Home</a>',
                             r'<a href="index.html" data-i18n="nav.home" class="nav-item nav-link">Home</a>', nav_content)
        nav_content = re.sub(r'<a href="branches\.html" data-i18n="nav\.branches">Branches</a>',
                             r'<a href="branches.html" data-i18n="nav.branches" class="nav-item nav-link">Branches</a>', nav_content)
        nav_content = re.sub(r'<a href="contact\.html" data-i18n="nav\.contact">Contact Us</a>',
                             r'<a href="contact.html" data-i18n="nav.contact" class="nav-item nav-link">Contact Us</a>', nav_content)
        nav_content = re.sub(r'<a href="service\.html" data-i18n="nav\.services">Services</a>',
                             r'<a href="service.html" data-i18n="nav.services" class="nav-item nav-link">Services</a>', nav_content)
        nav_content = re.sub(r'<a href="about\.html" data-i18n="nav\.about">About</a>',
                             r'<a href="about.html" data-i18n="nav.about" class="nav-item nav-link">About</a>', nav_content)
        
        # Dropdown items
        nav_content = re.sub(r'<a href="\./quality-policy\.html" data-i18n="nav\.quality_policy">Quality and policy</a>',
                             r'<a href="./quality-policy.html" data-i18n="nav.quality_policy" class="dropdown-item">Quality and policy</a>', nav_content)
        nav_content = re.sub(r'<a href="team\.html" data-i18n="nav\.team">Our Team</a>',
                             r'<a href="team.html" data-i18n="nav.team" class="dropdown-item">Our Team</a>', nav_content)
        nav_content = re.sub(r'<a href="\./health-safety\.html" data-i18n="nav\.health_safety">Health and Safety</a>',
                             r'<a href="./health-safety.html" data-i18n="nav.health_safety" class="dropdown-item">Health and Safety</a>', nav_content)
        nav_content = re.sub(r'<a href="\./general-conditions\.html" data-i18n="nav\.general_conditions">General conditions of the Service</a>',
                             r'<a href="./general-conditions.html" data-i18n="nav.general_conditions" class="dropdown-item">General conditions of the Service</a>', nav_content)
        
        nav_content = re.sub(r'<a href="tally-inspection\.html" data-i18n="nav\.tally_inspection">Tally Inspections and Supervisions</a>',
                             r'<a href="tally-inspection.html" data-i18n="nav.tally_inspection" class="dropdown-item">Tally Inspections and Supervisions</a>', nav_content)
        nav_content = re.sub(r'<a href="survey\.html" data-i18n="nav\.survey">Surveys</a>',
                             r'<a href="survey.html" data-i18n="nav.survey" class="dropdown-item">Surveys</a>', nav_content)
        nav_content = re.sub(r'<a href="\./p-i-claims-handling\.html" data-i18n="nav\.p_i_claims">P(&amp;|&)I Claims Handling</a>',
                             r'<a href="./p-i-claims-handling.html" data-i18n="nav.p_i_claims" class="dropdown-item">P\1I Claims Handling</a>', nav_content)
        nav_content = re.sub(r'<a href="loss-prevent\.html" data-i18n="nav\.loss_prevent">Loss prevention plans</a>',
                             r'<a href="loss-prevent.html" data-i18n="nav.loss_prevent" class="dropdown-item">Loss prevention plans</a>', nav_content)
        nav_content = re.sub(r'<a href="risk\.html" data-i18n="nav\.risk">Risk and management</a>',
                             r'<a href="risk.html" data-i18n="nav.risk" class="dropdown-item">Risk and management</a>', nav_content)
        nav_content = re.sub(r'<a href="fruit-perish\.html" data-i18n="nav\.fruit_perish">Fruit and perishables</a>',
                             r'<a href="fruit-perish.html" data-i18n="nav.fruit_perish" class="dropdown-item">Fruit and perishables</a>', nav_content)
        nav_content = re.sub(r'<a href="agri-food\.html" data-i18n="nav\.agri_food">Agrifood sector</a>',
                             r'<a href="agri-food.html" data-i18n="nav.agri_food" class="dropdown-item">Agrifood sector</a>', nav_content)

        if nav_content != original_nav:
            new_content = content.replace(original_nav, nav_content)
            with open(path, 'w', encoding='utf-8') as file:
                file.write(new_content)
            global count
            count += 1
            print(f"Fixed {filename}")

for root, _, files in os.walk(dir_path):
    for f in files:
        if f.endswith('.html'):
            filepath = os.path.join(root, f)
            process_file(filepath, os.path.relpath(filepath, dir_path))

print(f"Done. Fixed {count} files.")
