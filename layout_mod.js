// Global variables that I use enough that would be a pain to parameterize
// restylize todo on reload


const month_abbr = {"Jan":1, "Feb":2, "Mar":3, "Apr":4, "May":5, "Jun":6, "Jul":7, "Aug":8, "Sep":9, "Oct":10, "Nov":11, "Dec":12}
var list_stylized = false;
var list_items = document.getElementsByClassName("ToDoSidebarItem");
init_layout();

// sets up the basic new layout, fires dynamic list stylization
function init_layout() {
    const class_wind = document.createElement("iframe");
    class_wind.id = "class_wind";
    class_wind.addEventListener("load", strip_embed)

        
    var right_bar = document.getElementById("right-side-wrapper");
    right_bar.parentNode.removeChild(right_bar);
    var dash = document.getElementById("dashboard");
    


    var main_panel = document.getElementById("not_right_side");
    var header = document.getElementById("header");

    header.parentNode.removeChild(header);
    main_panel.prepend(header);


    var collapse = document.createElement("button");
    collapse.innerHTML = ">>";
    collapse.id = "sidebar";
    collapse.addEventListener("click", function () {
        if (right_bar.style.position == "sticky" || right_bar.style.right == "") {
            right_bar.style.right = -100 + "vw";
            right_bar.style.position = "absolute";
            collapse.innerHTML = " <<"
        } else {
            right_bar.style.position = "sticky";
            right_bar.style.right = 1 + "em";
            collapse.innerHTML = " >>"
        }
    })

    dash.append(class_wind);
    dash.append(right_bar)
    dash.prepend(collapse);

    trial();
}

// whelp untimed loop to wait for components to load; I'm tired of SO rabbitholes
function trial () {
    console.log("trial started")
    try {
        if (list_items.length == 0) {
            setTimeout(trial, 250);
        } else {
            if (!list_stylized) {
                list_fetch();
                
            }
        }
    } catch {
        setTimeout(trial, 250);
    }
}

// changes the appearance and location of the ToDo section
function list_fetch() {

    list_stylized = true;

    for (let i = 0; i < list_items.length; i++) {
        
        // establish references for easy access
        const icon = list_items[i].children[0];
        const task_name = list_items[i].children[1].children[0].children[0]
        const item_body = list_items[i].children[1].children[0];
        const close = list_items[i].children[2].children[0];
        const corrs_class = list_items[i].children[1].children[1]
        const pts_due = list_items[i].children[1].children[2]

        // abbreviate task and class names
        task_name.innerHTML = abbr_smcl(task_name.innerHTML);
        corrs_class.innerHTML = abbr_smcl(corrs_class.innerHTML);

        var pts = pts_due.children[0].innerHTML.split(" ")[0]
        if (!isNaN(pts)) {pts_due.children[0].innerHTML = pts + "pts"}

        var due_date = pts_due.children[pts_due.children.length - 1].innerText.split(" ")
        pts_due.children[pts_due.children.length - 1].innerText = `${due_date[3]} - ${month_abbr[due_date[0]]}/${due_date[1]}`
        if (pts_due.children.length == 1) {pts_due.style = "justify-content: flex-end !important;"; console.log("Singularity detected")}

        // remove items from existing configuration
        icon.parentNode.removeChild(icon);
        task_name.parentNode.removeChild(task_name);
        corrs_class.parentNode.removeChild(corrs_class);
        close.parentNode.removeChild(close);
        pts_due.parentNode.removeChild(pts_due);

        // inject items in at appropriate places
        item_body.prepend(corrs_class);
        item_body.prepend(icon);
        item_body.append(close);
        item_body.parentNode.appendChild(task_name);
        item_body.parentNode.appendChild(pts_due);
    }
    const tab_courses = document.createElement("div");
    tab_courses.id = "tab_courses"
    document.getElementById("dashboard").prepend(tab_courses)

    create_button("inbox_button", "Inbox", "https://canvas.liberty.edu/conversations", tab_courses);
    create_button("grades_button", "Calendar", "https://canvas.liberty.edu/calendar", tab_courses);
    create_button("grades_button", "View Grades", "https://canvas.liberty.edu/grades", tab_courses);

    var course_cards = document.getElementById("DashboardCard_Container").children[0].children[0].children;

    try {
        for (card in course_cards) {
            var url = course_cards[card].getElementsByClassName("ic-DashboardCard__link")[0].href
            var name = course_cards[card].getElementsByClassName("ic-DashboardCard__header-title")[0].children[0].innerHTML;
            var abbr = abbr_smcl(name);
            var section = name.slice(-5);
            var abbr_formatted = abbr.slice(0, 4) + " " + abbr.slice(4, 7) + " " + section
            
            console.log(abbr, section)
            try {
                var img = course_cards[card].getElementsByClassName("ic-DashboardCard__header_image")[0].style;
            } catch {}
            var term = course_cards[card].getElementsByClassName("ic-DashboardCard__header-term")[0].innerHTML;
            
            var alerts = document.getElementsByClassName("ic-DashboardCard__action-container")[card];
            var flag = alerts.getElementsByClassName("ic-DashboardCard__action-badge")[0];
            create_button(abbr, abbr_formatted, url, tab_courses);

            if (card == 0) {
                class_wind.src = url
                document.getElementById(abbr).focus()
            }
        };
    } catch {}

    const dash_header = document.getElementById("dashboard_header_container");
    dash_header.parentNode.removeChild(dash_header);

    const dash_cont = document.getElementById("DashboardCard_Container");
    dash_cont.parentNode.removeChild(dash_cont);

    const grades_extra = document.getElementById("right-side").children[2];
    grades_extra.parentNode.removeChild(grades_extra);

    const acct_btn = document.getElementById("global_nav_profile_link");
    const header_menu = document.getElementById("menu");
    header_menu.parentNode.removeChild(header_menu);

    const header_logo = document.getElementsByClassName("ic-app-header__logomark-container")[1];
    console.log(header_logo);

    const new_header = document.createElement("div");
    new_header.id = "new_header"
    new_header.innerText = "CANVAS++";
    header_logo.parentElement.appendChild(new_header);

    header_logo.parentNode.removeChild(header_logo);


}

function create_button(id, innerText, url, container) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add("course_button");
    button.innerText = innerText,
    button.setAttribute("url", url);
    button.addEventListener("click", function e(button){reload_embed_window(button)});
    container.appendChild(button);
}

// Removes unnecessary text from a given string
function abbr_smcl(text) {
    if (text.includes(":")) {
        return text.split(":")[0]
    } else {
        return text
    }
}

// strips the embedded window of all elements except class components
function strip_embed() {

    console.log("stripping embedded page")
    var doc = document.getElementById("class_wind").contentDocument;

    const new_style = document.createElement("style");
    new_style.textContent = `
    .item-group-condensed {
        margin: 0px !important; 
        padding: 0px !important;
    } 
    .ig-header {
        margin: 0px !important; 
        background-color: rgb(142, 141, 190) !important; 
        padding: 0px !important;
    } 
    .ContextModuleSubHeader_0 {
        display: none;
    }
    .ig-row {
        padding: 0px !important;
    }
    .content {
        display: inherit !important;
        overflow: visible !important;
    }
    .footer {
        display: none;
    }
    .ig-header .screenreader-only {
        display: none;
    }
    .ig-header-title {
        display: flex !important;
        justify-content: center;
        text-align: center;
        background-color: lavender;
    }
    .ig-header-title i {
        display: none;
    }
    .expand_module_link {
        display: none !important;
    }
    .prerequisites {
        display: none !important;
    }
    .requirements_message {
        display: none !important;
    }
    .percentComplete {
        display: none !important;
    }
    .ig-header-admin {
        display: none !important;
    }
    .module_item_icons {
        display: none;
    }
    .ig-info {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .module-item-status-icon {
        display: none;
    }
    .ig-header-title.collapse_module_link {
        display: none !important;
    }
    `;
    doc.head.appendChild(new_style);

    var wrapper = doc.getElementById("context_modules");
    wrapper.parentNode.removeChild(wrapper);
    var embed_app_nodes = doc.getElementById("application").children;

    for (child in embed_app_nodes) {
        embed_app_nodes[child].style = "display: none !important";
    }

    doc.getElementById("application").appendChild(wrapper);

    const modules = wrapper.children
    console.log(modules.length)

    for (let i = 0; i < modules.length; i++) {
        const name = modules[i].children[1].children[1].innerHTML;
        if (!name.includes("Module") && !name.includes("Week")) {
            modules[i].style = "display: none;"
        }
        var title = document.createElement("div");
        title.classList.add("ig-header-title");
        title.innerHTML = name;
        modules[i].prepend(title);
        modules[i].children[1].parentNode.removeChild(modules[i].children[1]);

        
        //modules[i].children[1].children[3].setAttribute("role", "div");

    }
}

function reload_embed_window(button){
    var url = button.target.getAttribute("url");
    class_wind.src = url;
}
//enRcg_bGBk enRcg_doqw enRcg_fNIu enRcg_eQnG
// loader class name eHQDY_cJVF
// switch .content and .right-side-wrapper
// .fOyUs_bGBk.jpyTq_bGBk.jpyTq_ycrn

//var main = document.getElementById("main");
//main.insertAdjacentElement(right_bar);



// https://hackr.io/blog/how-to-make-a-chrome-extension

// collapsibles 
// https://www.w3schools.com/howto/howto_js_collapsible.asp
// https://codeconvey.com/html-expand-collapse-text-without-javascript/

// display sole element in an iframe
// https://stackoverflow.com/questions/2828109/show-div-from-another-website

// Server-side has iframe display disabled. AFAIK there's nothing I can do to bypass it, even though
// this is technically cross-origin traffic. Weird. 
// https://stackoverflow.com/questions/1925998/jquery-wait-for-all-select-options-to-load
//https://stackoverflow.com/questions/17582383/mixing-javascript-and-jquery
// $('#contentDiv').load('/Test.html #container');

// Place for an AnnouncementWrapper