# backend/orchestrator.py

from agents.data_collector_agent import run_data_collector
from agents.macro_agent import run_macro_agent
from agents.sector_agent import run_sector_agent
from agents.portfolio_agent import run_portfolio_agent
from agents.risk_agent import run_risk_agent
from agents.report_generator_agent import run_report_generator

def run_all():
    print("Collecting market data...")
    data = run_data_collector()

    print("Analyzing macro environment...")
    macro = run_macro_agent(data)

    print("Forecasting sectors...")
    sectors = run_sector_agent(macro)

    print("Building portfolio...")
    portfolio = run_portfolio_agent(sectors)

    print("Analyzing risk...")
    risk = run_risk_agent(portfolio)

    print("Generating report...")
    report = run_report_generator(data, macro, sectors, portfolio, risk)

    return report