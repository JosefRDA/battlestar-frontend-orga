"use client"

import {
    Star,
    GitFork,
    ArrowUpRight,
    ArrowRight,
    Code2,
    Layers,
    Package,
    FileCode,
    Database,
    Bot,
    type LucideIcon,
    Eye,
    Loader2,
} from "lucide-react"
import Link from "next/link"
import { fetchGitHubRepos } from "@/app/actions/github"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GitHubRepo {
        id: number
        name: string
        full_name: string
        html_url: string
        description: string | null
        stargazers_count: number
        forks_count: number
        language: string | null
        topics: string[]
        updated_at: string
        watchers_count: number
    }

interface ProjectsListProps {
    className?: string
}

// Language color mapping
const LANGUAGE_COLORS: Record<string, string> = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    Python: "#3776ab",
    Java: "#b07219",
    "C#": "#178600",
    PHP: "#4F5D95",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Go: "#00ADD8",
    Ruby: "#CC342D",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
    Rust: "#DEA584",
    Dart: "#00B4AB",
    Shell: "#89e051",
    PowerShell: "#012456",
    "C++": "#f34b7d",
    C: "#555555",
    "Objective-C": "#438eff",
    Scala: "#c22d40",
    Lua: "#000080",
    Perl: "#0298c3",
    R: "#198CE7",
    Haskell: "#5e5086",
    Clojure: "#db5855",
    Elixir: "#6e4a7e",
    Vue: "#41b883",
    "Jupyter Notebook": "#DA5B0B",
    Assembly: "#6E4C13",
    MATLAB: "#e16737",
    Groovy: "#e69f56",
    Dockerfile: "#384d54",
    Makefile: "#427819",
    CMake: "#DA3434",
    Roff: "#ecdebe",
    "Vim script": "#199f4b",
    "Emacs Lisp": "#c065db",
    Yacc: "#4B6C4B",
    Lex: "#DBCA00",
    Awk: "#c30e9b",
    M4: "#fcd46d",
    TeX: "#3D6117",
    Fortran: "#4d41b1",
    "DIGITAL Command Language": "#000000",
    SQLPL: "#e38c00",
    PLSQL: "#dad8d8",
    TSQL: "#e38c00",
    Tcl: "#e4cc98",
    Apex: "#1797c0",
    ABAP: "#E8274B",
    COBOL: "#000000",
    AutoHotkey: "#6594b9",
    ASP: "#6a40fd",
    ActionScript: "#882B0F",
    Ada: "#02f88c",
    AppleScript: "#101F1F",
    Arc: "#aa2afe",
    AspectJ: "#a957b0",
    Augeas: "#9CC134",
    Ballerina: "#FF5000",
    Batchfile: "#C1F12E",
    Befunge: "#0a0a0a",
    Bison: "#6A463F",
    BitBake: "#00bce4",
    Blade: "#f7523f",
    BlitzBasic: "#00FFAE",
    BlitzMax: "#cd6400",
    Bluespec: "#12223c",
    Boo: "#d4bec1",
    Brainfuck: "#2F2530",
    Brightscript: "#662D91",
    Browserslist: "#ffd539",
    CoffeeScript: "#244776",
    Crystal: "#000100",
    Cuda: "#3A4E3A",
    D: "#ba595e",
    DM: "#447265",
    Dhall: "#dfafff",
    Dogescript: "#cca760",
    Dylan: "#6c616e",
    E: "#ccce35",
    ECL: "#8a1267",
    EJS: "#a91e50",
    Eiffel: "#946d57",
    Elm: "#60B5CC",
    EmberScript: "#FFF4F3",
    Erlang: "#B83998",
    "F#": "#b845fc",
    FLUX: "#88ccff",
    Factor: "#636746",
    Fancy: "#7b9db4",
    Fantom: "#14253c",
    Faust: "#c37240",
    Forth: "#341708",
    FreeMarker: "#0050b2",
    Frege: "#00cafe",
    GDScript: "#355570",
    "Game Maker Language": "#71b417",
    Genie: "#fb855d",
    Gherkin: "#5B2063",
    Glyph: "#c1ac7f",
    Gnuplot: "#f0a9f0",
    Golo: "#88562A",
    Gosu: "#82937f",
    "Grammatical Framework": "#79aa7a",
    Hack: "#878787",
    Haml: "#ece2a9",
    Handlebars: "#f7931e",
    Harbour: "#0e60e3",
    Haxe: "#df7900",
    HiveQL: "#dce200",
    HolyC: "#ffefaf",
    Hy: "#7790B2",
    IDL: "#a3522f",
    Idris: "#b30000",
    Io: "#a9188d",
    Ioke: "#078193",
    Isabelle: "#FEFE00",
    J: "#9EEDFF",
    JFlex: "#DBCA00",
    JSONiq: "#40d47e",
    Jolie: "#843179",
    Jsonnet: "#0064bd",
    Julia: "#a270ba",
    KRL: "#28430A",
    LFE: "#4C3023",
    LLVM: "#185619",
    LOLCODE: "#cc9900",
    LSL: "#3d9970",
    Lasso: "#999999",
    LiveScript: "#499886",
    LookML: "#652B81",
    MAXScript: "#00a6a6",
    MLIR: "#5EC8DB",
    MQL4: "#62A8D6",
    MQL5: "#4A76B8",
    MTML: "#b7e1f4",
    Mask: "#f97732",
    Max: "#c4a79c",
    Mercury: "#ff2b2b",
    Meson: "#007800",
    Metal: "#8f14e9",
    Mirah: "#c7a938",
    "Modula-3": "#223388",
    NCL: "#28431f",
    Nearley: "#990000",
    Nemerle: "#3d3c6e",
    NetLinx: "#0aa0ff",
    "NetLinx+ERB": "#747faa",
    NetLogo: "#ff6375",
    NewLisp: "#87AED7",
    Nextflow: "#3ac486",
    Nim: "#ffc200",
    Nit: "#009917",
    Nix: "#7e7eff",
    Nu: "#c9df40",
    NumPy: "#9C8AF9",
    OCaml: "#3be133",
    ObjectScript: "#424893",
    "Objective-C++": "#6866fb",
    "Objective-J": "#ff0c5a",
    Odin: "#60AFFE",
    Omgrofl: "#cabbff",
    Opal: "#f7ede0",
    OpenQASM: "#AA70FF",
    Oxygene: "#cdd0e3",
    Oz: "#fab738",
    P4: "#7055b5",
    Pan: "#cc0000",
    Papyrus: "#6600cc",
    Parrot: "#f3ca0a",
    Pascal: "#E3F171",
    Pawn: "#dbb284",
    Pep8: "#C76F5B",
    PigLatin: "#fcd7de",
    Pike: "#005390",
    PogoScript: "#d80074",
    PostScript: "#da291c",
    PowerBuilder: "#8f0f8d",
    Prisma: "#0c344b",
    Processing: "#0096D8",
    Prolog: "#74283c",
    "Propeller Spin": "#7fa2a7",
    Puppet: "#302B6D",
    PureBasic: "#5a6986",
    PureScript: "#1D222D",
    "Q#": "#fed659",
    QML: "#44a51c",
    "Qt Script": "#00b841",
    Quake: "#882233",
    RAML: "#77d9fb",
    RUNOFF: "#665a4e",
    Racket: "#3c5caa",
    Ragel: "#9d5200",
    Raku: "#0000fb",
    Rascal: "#fffaa0",
    ReScript: "#ed5051",
    Reason: "#ff5847",
    Rebol: "#358a5b",
    Red: "#f50000",
    "Ren'Py": "#ff7f7f",
    Ring: "#2D54CB",
    Riot: "#A71E49",
    Rouge: "#cc0088",
    SAS: "#B34936",
    SCSS: "#c6538c",
    SPARQL: "#0C4597",
    SQF: "#3F3F3F",
    SQL: "#e38c00",
    "SRecode Template": "#348a34",
    SVG: "#ff9900",
    SaltStack: "#646464",
    Scheme: "#1e4aec",
    Self: "#0579aa",
    Shen: "#120F14",
    Slash: "#007eff",
    Slice: "#003fa2",
    Smalltalk: "#596706",
    Solidity: "#AA6746",
    SourcePawn: "#f69e1d",
    Squirrel: "#800000",
    Stan: "#b2011d",
    "Standard ML": "#dc566d",
    Starlark: "#76d275",
    SuperCollider: "#46390b",
    SystemVerilog: "#DAE1C2",
    "TI Program": "#A0AA87",
    Terra: "#00004c",
    Turing: "#cf142b",
    Twig: "#c1d026",
    Uno: "#9933cc",
    UnrealScript: "#a54c4d",
    V: "#4f87c4",
    VBA: "#867db1",
    VBScript: "#15dcdc",
    VCL: "#148AA8",
    VHDL: "#adb2cb",
    Vala: "#fbe5cd",
    Verilog: "#b2b7f8",
    "Visual Basic .NET": "#945db7",
    Volt: "#1F1F1F",
    WebAssembly: "#04133b",
    Wollok: "#a23738",
    X10: "#4B6BEF",
    XC: "#99DA07",
    XQuery: "#5232e7",
    XSLT: "#EB8CEB",
    Yara: "#220000",
    YASnippet: "#32AB90",
    ZAP: "#0d665e",
    ZIL: "#dc75e5",
    ZenScript: "#00BCD1",
    Zephir: "#118f9e",
    Zig: "#ec915c",
    eC: "#913960",
    fish: "#4aae47",
    "mIRC Script": "#3d57c3",
    mcfunction: "#E22837",
    nesC: "#94B0C7",
    ooc: "#b0b77e",
    q: "#0040cd",
    sed: "#64b970",
    wdl: "#42f1f4",
    wisp: "#7582D1",
    xBase: "#403a40",
}

// Icon mapping based on language or name patterns
function getIconForRepo(repo: GitHubRepo): LucideIcon {
        const name = repo.name.toLowerCase()
        const language = repo.language?.toLowerCase() || ""
    
    if (name.includes("dashboard") || name.includes("admin") || name.includes("ui")) {
                return Layers
            } else if (language === "javascript" || language === "typescript" || name.includes("component")) {
                return Code2
            } else if (name.includes("api") || name.includes("server") || name.includes("backend")) {
                return Package
            } else if (name.includes("db") || name.includes("database") || name.includes("sql")) {
                return Database
            } else if (name.includes("ai") || name.includes("bot") || name.includes("assistant")) {
                return Bot
            } else {
                return FileCode
            }
    }

export default function ProjectsList({ className }: ProjectsListProps) {
    const [repos, setRepos] = useState<GitHubRepo[]>([])
        const [isLoading, setIsLoading] = useState(true)
        const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
                async function loadRepos() {
                        try {
                                setIsLoading(true)
                                const data = await fetchGitHubRepos()
                                setRepos(data)
                                setError(null)
                            } catch (err) {
                                setError("Failed to load repositories")
                                console.error(err)
                            } finally {
                                setIsLoading(false)
                            }
                    }
        
        loadRepos()
            }, [])
    
    // Display only the first 6 repos
        const displayRepos = repos.slice(0, 6)
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={cn("transition-all duration-200")}
        >
            <div
            className={cn(
                "w-full max-w-full mx-auto",
                "bg-white dark:bg-zinc-900/70",
                "border border-zinc-100 dark:border-zinc-800",
                "rounded-xl shadow-sm backdrop-blur-xl",
                className,
            )}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        GitHub Projects
                        <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
                        ({isLoading ? "..." : repos.length})
                        </span>
                    </h2>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">@MGalaCyber</span>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                            <span className="ml-2 text-sm text-zinc-500">Loading repositories...</span>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500 dark:text-red-400">
                            <p>{error}</p>
                            <p className="text-sm mt-2">Using fallback data instead</p>
                        </div>
                    ) : repos.length === 0 ? (
                        <div className="p-4 text-center text-zinc-500 dark:text-zinc-400">No repositories found</div>
                    ) : (
                        <div className="space-y-2">
                            {displayRepos.map((repo, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className={cn("transition-all duration-200")}
                                >
                                    {(() => {
                                        const Icon = getIconForRepo(repo)
                                        const languageColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#888888" : "#888888"
            
                                        return (
                                            <div
                                            key={repo.id}
                                            className={cn(
                                                "group flex items-start gap-3",
                                                "p-3 rounded-lg",
                                                "bg-gray-300 dark:bg-zinc-800/50",
                                                "border border-zinc-100 dark:border-zinc-700/50",
                                                "hover:bg-zinc-200 dark:hover:bg-zinc-800",
                                                "transition-all duration-200",
                                            )}
                                            >
                                            <div
                                                className={cn(
                                                "p-2 rounded-lg mt-0.5",
                                                "bg-zinc-100 dark:bg-zinc-800",
                                                "border border-zinc-200 dark:border-zinc-700",
                                                )}
                                            >
                                                <Icon className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
                                            </div>
            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center">
                                                    {repo.name}
                                                    {repo.language && (
                                                        <span className="ml-2 flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                                                        <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: languageColor }} />
                                                        {repo.language}
                                                        </span>
                                                    )}
                                                    </h3>
                                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
                                                    {repo.description || "No description available"}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={cn(
                                                    "p-1.5 rounded-full",
                                                    "bg-zinc-200 dark:bg-zinc-700",
                                                    "hover:bg-zinc-300 dark:hover:bg-zinc-600",
                                                    "transition-colors duration-200",
                                                    "flex-shrink-0 ml-2",
                                                    )}
                                                >
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                                                </Link>
                                                </div>
            
                                                <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                                                    <Star className="w-3.5 h-3.5 mr-1 text-amber-500" />
                                                    {repo.stargazers_count.toLocaleString()}
                                                </div>
                                                <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                                                    <GitFork className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                    {repo.forks_count.toLocaleString()}
                                                </div>
                                                <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                                                    <Eye className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                    {repo.watchers_count.toLocaleString()}
                                                </div>
                                                </div>
                                            </div>
                                            </div>
                                        )
                                    })()}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {isLoading ? "" : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className={cn("transition-all duration-200")}
                    >
                        <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
                            <Link
                            href={`https://github.com/MGalaCyber?tab=repositories`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "w-full flex items-center justify-center gap-2",
                                "py-2 px-3 rounded-lg",
                                "text-xs font-medium",
                                "bg-gradient-to-r from-zinc-900 to-zinc-800",
                                "dark:from-zinc-50 dark:to-zinc-200",
                                "text-zinc-50 dark:text-zinc-900",
                                "hover:from-zinc-800 hover:to-zinc-700",
                                "dark:hover:from-zinc-200 dark:hover:to-zinc-300",
                                "shadow-sm hover:shadow",
                                "transform transition-all duration-200",
                                "hover:-translate-y-0.5",
                                "active:translate-y-0",
                                "focus:outline-none focus:ring-2",
                                "focus:ring-zinc-500 dark:focus:ring-zinc-400",
                                "focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
                            )}
                            >
                            <span>View All Projects</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
/*

⛔️ 𝕊𝕖𝕔𝕦𝕣𝕖𝕕 𝕓𝕪: M̸̹̓G̸̬͠A̸̘̓L̷̢̕A̵̳̅C̸͇̍Y̷̛̰B̵̳̒E̵͖̾R̴̻͋™ - [𝗨𝗜𝗗: 𝕄𝕏𝔾-𝟜𝟛𝟞𝕏-𝟘𝕎𝟞𝕄] 🔐 KeyHash: MGX!@#💠z9Kq-4vA03_×n9s2**a|∞⁂ 🧬 TraceSig: 𝓧𝓡𝓧-𝟿𝓍𝓍-𝓜𝓖𝓧-2025.ΔZ::00FA ⚠️ AntiTamper ID: [#MGA-LOCK-ᗰᘜᗩ-ꜱƈʀ-99Xx-⊘Δ] 🌀 BaseNode 𝕍: 𝓟𝓱𝓪𝓷𝓽𝓸𝓶𝟜𝓣𝓱𝓮𝓶𝓮[.RΞ] | Engine ID: MGLCBR-X420-π */