from selenium import webdriver
from selenium.webdriver.common.by import By
import time

navegador = webdriver.Chrome()
navegador.get("http://localhost:8081")
time.sleep(1)

navegador.find_element(By.XPATH, "")